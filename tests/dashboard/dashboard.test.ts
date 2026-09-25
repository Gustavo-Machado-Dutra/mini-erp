import assert from 'node:assert/strict'
import test from 'node:test'
import { isRecoveredAttributionType } from '../../src/modules/conversions/types'
import type { LeadStage } from '../../src/db/schema/leads'

interface MockRevenue {
  id: string
  organizationId: string
  amount: number
  occurredAt: Date
  conversionId: string | null
}

interface MockConversion {
  id: string
  organizationId: string
  attributionType: string
  convertedAt: Date
}

interface MockFollowUp {
  id: string
  organizationId: string
  status: 'pending' | 'completed' | 'cancelled'
  scheduledAt: Date
}

interface MockCustomer {
  id: string
  organizationId: string
}

interface MockLead {
  id: string
  organizationId: string
  stage: LeadStage
  createdAt: Date
}

class DashboardDomainEngine {
  private revenue: MockRevenue[] = []
  private conversions: MockConversion[] = []
  private followUps: MockFollowUp[] = []
  private customers: MockCustomer[] = []
  private leads: MockLead[] = []

  addRevenue(orgId: string, amount: number, occurredAt: Date, conversionId: string | null = null) {
    this.revenue.push({ id: `r${this.revenue.length}`, organizationId: orgId, amount, occurredAt, conversionId })
  }
  addConversion(orgId: string, attributionType: string, convertedAt: Date) {
    this.conversions.push({ id: `c${this.conversions.length}`, organizationId: orgId, attributionType, convertedAt })
  }
  addFollowUp(orgId: string, status: 'pending' | 'completed' | 'cancelled', scheduledAt: Date) {
    this.followUps.push({ id: `f${this.followUps.length}`, organizationId: orgId, status, scheduledAt })
  }
  addCustomer(orgId: string) {
    this.customers.push({ id: `cu${this.customers.length}`, organizationId: orgId })
  }
  addLead(orgId: string, stage: LeadStage, createdAt: Date) {
    this.leads.push({ id: `l${this.leads.length}`, organizationId: orgId, stage, createdAt })
  }

  getMetrics(orgId: string) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const leads30d = this.leads.filter((l) => l.organizationId === orgId && l.createdAt >= thirtyDaysAgo).length
    const conversions30d = this.conversions.filter((c) => c.organizationId === orgId && c.convertedAt >= thirtyDaysAgo).length
    const conversionRate = leads30d > 0 ? Math.round((conversions30d / leads30d) * 1000) / 10 : 0

    const registeredRevenue30d = this.revenue
      .filter((r) => r.organizationId === orgId && r.occurredAt >= thirtyDaysAgo)
      .reduce((sum, r) => sum + r.amount, 0)

    const recoveredRevenue30d = this.revenue
      .filter((r) => r.organizationId === orgId && r.occurredAt >= thirtyDaysAgo && r.conversionId)
      .reduce((sum, r) => {
        const conv = this.conversions.find((c) => c.id === r.conversionId && c.organizationId === orgId)
        return sum + (conv && isRecoveredAttributionType(conv.attributionType as never) ? r.amount : 0)
      }, 0)

    let today = 0
    let overdue = 0
    let upcoming = 0
    let pending = 0
    for (const f of this.followUps) {
      if (f.organizationId !== orgId || f.status !== 'pending') continue
      pending++
      if (f.scheduledAt >= startOfToday && f.scheduledAt <= endOfToday) today++
      else if (f.scheduledAt < startOfToday) overdue++
      else upcoming++
    }

    const pipeline = (['new', 'contacted', 'interested', 'scheduled', 'converted', 'lost'] as LeadStage[]).map(
      (stage) => ({ stage, count: this.leads.filter((l) => l.organizationId === orgId && l.stage === stage).length })
    )

    const totalCustomers = this.customers.filter((c) => c.organizationId === orgId).length

    return {
      leads30d,
      conversions30d,
      conversionRate,
      pendingFollowUps: pending,
      todayFollowUps: today,
      overdueFollowUps: overdue,
      upcomingFollowUps: upcoming,
      registeredRevenue30d,
      recoveredRevenue30d,
      totalCustomers,
      pipeline,
    }
  }
}

test('Fase 10 - Dashboard Analytics Domain Suite', async (t) => {
  const engine = new DashboardDomainEngine()
  const orgA = 'org_a'
  const orgB = 'org_b'
  const now = new Date()

  // Org A: dados reais
  engine.addLead(orgA, 'new', now)
  engine.addLead(orgA, 'contacted', now)
  engine.addLead(orgA, 'converted', now)
  engine.addConversion(orgA, 'follow_up_conversion', now)
  engine.addConversion(orgA, 'manual_conversion', now)
  engine.addRevenue(orgA, 100, now, null) // sem conversão -> registrada, não recuperada
  engine.addRevenue(orgA, 300, now, 'c0') // follow_up -> recuperada
  engine.addRevenue(orgA, 200, now, 'c1') // manual -> registrada, não recuperada
  engine.addFollowUp(orgA, 'pending', now)
  engine.addFollowUp(orgA, 'pending', new Date(now.getTime() - 86400000 * 5))
  engine.addFollowUp(orgA, 'completed', now)
  engine.addCustomer(orgA)
  engine.addCustomer(orgA)

  // Org B: dados próprios (isolamento)
  engine.addRevenue(orgB, 9999, now)
  engine.addLead(orgB, 'new', now)

  await t.test('1. Métricas: Org A retorna valores corretos', () => {
    const m = engine.getMetrics(orgA)
    assert.equal(m.leads30d, 3)
    assert.equal(m.conversions30d, 2)
    assert.equal(m.conversionRate, 66.7)
    assert.equal(m.pendingFollowUps, 2)
    assert.equal(m.todayFollowUps, 1)
    assert.equal(m.overdueFollowUps, 1)
    assert.equal(m.upcomingFollowUps, 0)
    assert.equal(m.registeredRevenue30d, 600)
    assert.equal(m.recoveredRevenue30d, 300)
    assert.equal(m.totalCustomers, 2)
  })

  await t.test('2. Receita registrada ≠ receita recuperada', () => {
    const m = engine.getMetrics(orgA)
    assert.ok(m.registeredRevenue30d > m.recoveredRevenue30d)
    assert.equal(m.recoveredRevenue30d, 300)
  })

  await t.test('3. Pipeline: contagens por estágio da Org A', () => {
    const m = engine.getMetrics(orgA)
    const pipeline = Object.fromEntries(m.pipeline.map((p) => [p.stage, p.count]))
    assert.equal(pipeline.new, 1)
    assert.equal(pipeline.contacted, 1)
    assert.equal(pipeline.converted, 1)
    assert.equal(pipeline.lost, 0)
  })

  await t.test('4. Isolamento: Org B não recebe dados de Org A', () => {
    const a = engine.getMetrics(orgA)
    const b = engine.getMetrics(orgB)
    assert.equal(b.leads30d, 1)
    assert.equal(b.pendingFollowUps, 0)
    assert.equal(b.totalCustomers, 0)
    assert.equal(b.registeredRevenue30d, 9999)
    assert.notEqual(a.registeredRevenue30d, b.registeredRevenue30d)
  })

  await t.test('5. Isolamento: receita recuperada de A não vaza para B', () => {
    const b = engine.getMetrics(orgB)
    assert.equal(b.recoveredRevenue30d, 0)
  })
})
