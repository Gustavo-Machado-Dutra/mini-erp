import assert from 'node:assert/strict'
import test from 'node:test'
import { createConversionSchema } from '../../src/modules/conversions/schemas'
import {
  CONVERSION_ATTRIBUTION_TYPES,
  isRecoveredAttributionType,
  RECOVERED_ATTRIBUTION_TYPES,
} from '../../src/modules/conversions/types'
import type { Customer } from '../../src/db/schema/customers'
import type { Lead } from '../../src/db/schema/leads'

interface MockUser {
  id: string
  name: string
  email: string
}

interface MockMembership {
  id: string
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
}

class ConversionsDomainEngine {
  private organizations = new Map<string, { id: string; name: string; slug: string }>()
  private memberships: MockMembership[] = []
  private customers: Customer[] = []
  private leads: Lead[] = []
  private conversions: Array<{
    id: string
    organizationId: string
    customerId: string | null
    leadId: string | null
    appointmentId: string | null
    attributionType: string
    amount: string
    convertedAt: Date
    notes: string | null
    createdBy: string | null
  }> = []

  createOrg(user: MockUser, slug: string) {
    const org = { id: `org_${slug}`, name: slug, slug }
    this.organizations.set(org.id, org)
    this.memberships.push({ id: `mem_${slug}`, organizationId: org.id, userId: user.id, role: 'owner' })
    return org
  }

  createCustomer(orgId: string, name: string): Customer {
    const cust: Customer = {
      id: `cust_${this.customers.length + 1}`,
      organizationId: orgId,
      name,
      email: null,
      phone: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'sys',
    }
    this.customers.push(cust)
    return cust
  }

  createLead(orgId: string, name: string): Lead {
    const lead: Lead = {
      id: `lead_${this.leads.length + 1}`,
      organizationId: orgId,
      customerId: null,
      name,
      email: null,
      phone: null,
      source: 'website',
      stage: 'new',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'sys',
    }
    this.leads.push(lead)
    return lead
  }

  requireOrganization(sessionUser: MockUser | null, orgId: string) {
    if (!sessionUser) throw new Error('401: Unauthorized')
    const org = this.organizations.get(orgId)
    if (!org) throw new Error('404: Organização não encontrada')
    const membership = this.memberships.find((m) => m.organizationId === orgId && m.userId === sessionUser.id)
    if (!membership) throw new Error('403: Forbidden - Usuário não pertence a esta organização')
    return { org, user: sessionUser }
  }

  createConversion(sessionUser: MockUser | null, orgId: string, rawInput: unknown) {
    const { org, user } = this.requireOrganization(sessionUser, orgId)
    const parsed = createConversionSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    if (parsed.data.customerId) {
      const cust = this.customers.find((c) => c.id === parsed.data.customerId && c.organizationId === org.id)
      if (!cust) throw new Error('400: Cliente não pertence à organização')
    }
    if (parsed.data.leadId) {
      const lead = this.leads.find((l) => l.id === parsed.data.leadId && l.organizationId === org.id)
      if (!lead) throw new Error('400: Lead não pertence à organização')
    }

    const conversion = {
      id: `cv_${this.conversions.length + 1}`,
      organizationId: org.id,
      customerId: parsed.data.customerId,
      leadId: parsed.data.leadId,
      appointmentId: parsed.data.appointmentId,
      attributionType: parsed.data.attributionType,
      amount: parsed.data.amount.toFixed(2),
      convertedAt: parsed.data.convertedAt,
      notes: parsed.data.notes,
      createdBy: user.id,
    }
    this.conversions.push(conversion)

    if (parsed.data.leadId) {
      const lead = this.leads.find((l) => l.id === parsed.data.leadId)
      if (lead) lead.stage = 'converted'
    }
    return conversion
  }

  getLead(id: string) {
    return this.leads.find((l) => l.id === id) ?? null
  }

  getById(id: string, orgId: string) {
    const conv = this.conversions.find((c) => c.id === id)
    if (!conv || conv.organizationId !== orgId) return null
    return conv
  }
}

test('Conversions Domain & Multi-Tenant Security Suite', async (t) => {
  const engine = new ConversionsDomainEngine()
  const userA: MockUser = { id: 'u_a', name: 'A', email: 'a@a.com' }
  const userB: MockUser = { id: 'u_b', name: 'B', email: 'b@b.com' }
  const orgA = engine.createOrg(userA, 'org_a')
  const orgB = engine.createOrg(userB, 'org_b')

  const customerA = engine.createCustomer(orgA.id, 'Cliente A')
  const leadA = engine.createLead(orgA.id, 'Lead A')
  const customerB = engine.createCustomer(orgB.id, 'Cliente B')
  const leadB = engine.createLead(orgB.id, 'Lead B')

  await t.test('1. Create: Usuário A registra conversão na Org A com sucesso', () => {
    const conv = engine.createConversion(userA, orgA.id, {
      customerId: customerA.id,
      attributionType: 'follow_up_conversion',
      amount: 500,
      convertedAt: new Date(),
    })
    assert.equal(conv.organizationId, orgA.id)
    assert.equal(conv.attributionType, 'follow_up_conversion')
    assert.equal(conv.amount, '500.00')
  })

  await t.test('2. Create: Conversão vinculada a Lead marca estágio como converted', () => {
    const conv = engine.createConversion(userA, orgA.id, {
      leadId: leadA.id,
      attributionType: 'direct_conversion',
      amount: 250.5,
      convertedAt: new Date(),
    })
    assert.equal(conv.leadId, leadA.id)
    const updatedLead = engine.getLead(leadA.id)
    assert.equal(updatedLead?.stage, 'converted')
  })

  await t.test('3. Cross-Tenant: Org A não pode converter Cliente da Org B', () => {
    assert.throws(
      () => engine.createConversion(userA, orgA.id, { customerId: customerB.id, amount: 100, convertedAt: new Date() }),
      /Cliente não pertence à organização/
    )
  })

  await t.test('4. Cross-Tenant: Org A não pode converter Lead da Org B', () => {
    assert.throws(
      () => engine.createConversion(userA, orgA.id, { leadId: leadB.id, amount: 100, convertedAt: new Date() }),
      /Lead não pertence à organização/
    )
  })

  await t.test('5. Cross-Tenant IDOR: Usuário B não lê conversão da Org A', () => {
    const conv = engine.createConversion(userA, orgA.id, { customerId: customerA.id, amount: 90, convertedAt: new Date() })
    assert.equal(engine.getById(conv.id, orgB.id), null)
    assert.notEqual(engine.getById(conv.id, orgA.id), null)
  })

  await t.test('6. Validation: Exige Cliente ou Lead', () => {
    assert.throws(
      () => engine.createConversion(userA, orgA.id, { amount: 100, convertedAt: new Date() }),
      /Cliente ou a um Lead/
    )
  })

  await t.test('7. Validation: Rejeita valor negativo', () => {
    assert.throws(
      () => engine.createConversion(userA, orgA.id, { customerId: customerA.id, amount: -5, convertedAt: new Date() }),
      /negativo/
    )
  })

  await t.test('8. Validation: Rejeita attribution_type inválido', () => {
    const parsed = createConversionSchema.safeParse({
      customerId: customerA.id,
      attributionType: 'bogus',
      amount: 10,
      convertedAt: new Date(),
    })
    assert.equal(parsed.success, false)
  })

  await t.test('9. Mass Assignment: organization_id e created_by são ignorados pelo schema', () => {
    const parsed = createConversionSchema.safeParse({
      customerId: customerA.id,
      amount: 10,
      convertedAt: new Date(),
      organizationId: orgB.id,
      createdBy: 'hacker',
    })
    assert.equal(parsed.success, true)
    const data = parsed.data as any
    assert.equal(data.organizationId, undefined)
    assert.equal(data.createdBy, undefined)
  })

  await t.test('10. Unauthenticated: Acesso sem sessão é bloqueado', () => {
    assert.throws(() => engine.createConversion(null, orgA.id, { customerId: customerA.id, amount: 10, convertedAt: new Date() }), /401/)
  })

  await t.test('11. Attribution: follow_up/reactivation contam como recuperada; demais não', () => {
    assert.ok(isRecoveredAttributionType('follow_up_conversion'))
    assert.ok(isRecoveredAttributionType('reactivation_conversion'))
    assert.equal(isRecoveredAttributionType('direct_conversion'), false)
    assert.equal(isRecoveredAttributionType('manual_conversion'), false)
    assert.equal(isRecoveredAttributionType('unknown'), false)
    assert.equal(RECOVERED_ATTRIBUTION_TYPES.length, 2)
  })

  await t.test('12. Attribution: todos os tipos da SPEC são aceitos pelo enum', () => {
    for (const type of CONVERSION_ATTRIBUTION_TYPES) {
      const parsed = createConversionSchema.safeParse({ customerId: customerA.id, attributionType: type, amount: 10, convertedAt: new Date() })
      assert.equal(parsed.success, true, `deveria aceitar ${type}`)
    }
  })
})

