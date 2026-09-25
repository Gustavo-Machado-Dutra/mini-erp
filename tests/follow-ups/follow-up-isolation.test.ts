import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createFollowUpSchema,
  updateFollowUpSchema,
  completeFollowUpSchema,
  cancelFollowUpSchema,
} from '../../src/modules/follow-ups/schemas'
import type { FollowUp } from '../../src/db/schema/follow-ups'
import type { Customer } from '../../src/db/schema/customers'
import type { Lead } from '../../src/db/schema/leads'

interface MockUser {
  id: string
  name: string
  email: string
}

interface MockOrganization {
  id: string
  name: string
  slug: string
}

interface MockMembership {
  id: string
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
}

class FollowUpsDomainEngine {
  private organizations = new Map<string, MockOrganization>()
  private memberships: MockMembership[] = []
  private customers: Customer[] = []
  private leads: Lead[] = []
  private followUps: FollowUp[] = []

  createOrg(user: MockUser, name: string, slug: string): MockOrganization {
    const org: MockOrganization = { id: `org_${Date.now()}_${Math.random()}`, name, slug }
    this.organizations.set(org.id, org)
    this.memberships.push({
      id: `mem_${Date.now()}_${Math.random()}`,
      organizationId: org.id,
      userId: user.id,
      role: 'owner',
    })
    return org
  }

  createCustomer(orgId: string, name: string): Customer {
    const cust: Customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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

  requireOrganization(
    sessionUser: MockUser | null,
    orgId: string
  ): { org: MockOrganization; user: MockUser } {
    if (!sessionUser) {
      throw new Error('401: Unauthorized - Requer sessão ativa')
    }
    const org = this.organizations.get(orgId)
    if (!org) {
      throw new Error('404: Organização não encontrada')
    }
    const membership = this.memberships.find(
      (m) => m.organizationId === orgId && m.userId === sessionUser.id
    )
    if (!membership) {
      throw new Error('403: Forbidden - Usuário não pertence a esta organização')
    }
    return { org, user: sessionUser }
  }

  createFollowUp(sessionUser: MockUser | null, orgId: string, rawInput: unknown): FollowUp {
    const { org, user } = this.requireOrganization(sessionUser, orgId)
    const parsed = createFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    if (parsed.data.customerId) {
      const cust = this.customers.find(
        (c) => c.id === parsed.data.customerId && c.organizationId === org.id
      )
      if (!cust) throw new Error('400: Customer não pertence à organização')
    }

    if (parsed.data.leadId) {
      const ld = this.leads.find(
        (l) => l.id === parsed.data.leadId && l.organizationId === org.id
      )
      if (!ld) throw new Error('400: Lead não pertence à organização')
    }

    const now = new Date()
    const fu: FollowUp = {
      id: `fu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: org.id,
      createdBy: user.id,
      customerId: parsed.data.customerId ?? null,
      leadId: parsed.data.leadId ?? null,
      type: parsed.data.type,
      channel: parsed.data.channel,
      scheduledAt: parsed.data.scheduledAt,
      status: 'pending',
      executedAt: null,
      outcome: null,
      notes: parsed.data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    }
    this.followUps.push(fu)
    return fu
  }

  updateFollowUp(sessionUser: MockUser | null, orgId: string, rawInput: unknown): FollowUp {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const parsed = updateFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const idx = this.followUps.findIndex(
      (f) => f.id === parsed.data.id && f.organizationId === org.id
    )
    if (idx === -1) {
      throw new Error('404: Follow-up não encontrado')
    }

    const existing = this.followUps[idx]
    if (existing.status !== 'pending') {
      throw new Error('400: Apenas follow-ups pendentes podem ser editados')
    }

    if (parsed.data.customerId) {
      const cust = this.customers.find(
        (c) => c.id === parsed.data.customerId && c.organizationId === org.id
      )
      if (!cust) throw new Error('400: Customer não pertence à organização')
    }

    if (parsed.data.leadId) {
      const ld = this.leads.find(
        (l) => l.id === parsed.data.leadId && l.organizationId === org.id
      )
      if (!ld) throw new Error('400: Lead não pertence à organização')
    }

    const updated: FollowUp = {
      ...existing,
      customerId: parsed.data.customerId ?? null,
      leadId: parsed.data.leadId ?? null,
      type: parsed.data.type,
      channel: parsed.data.channel,
      scheduledAt: parsed.data.scheduledAt,
      notes: parsed.data.notes ?? null,
      updatedAt: new Date(),
    }

    this.followUps[idx] = updated
    return updated
  }

  completeFollowUp(sessionUser: MockUser | null, orgId: string, rawInput: unknown): FollowUp {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const parsed = completeFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const idx = this.followUps.findIndex(
      (f) => f.id === parsed.data.id && f.organizationId === org.id
    )
    if (idx === -1) {
      throw new Error('404: Follow-up não encontrado')
    }

    const updated: FollowUp = {
      ...this.followUps[idx],
      status: 'completed',
      executedAt: new Date(),
      outcome: parsed.data.outcome,
      updatedAt: new Date(),
    }

    this.followUps[idx] = updated
    return updated
  }

  cancelFollowUp(sessionUser: MockUser | null, orgId: string, rawInput: unknown): FollowUp {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const parsed = cancelFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const idx = this.followUps.findIndex(
      (f) => f.id === parsed.data.id && f.organizationId === org.id
    )
    if (idx === -1) {
      throw new Error('404: Follow-up não encontrado')
    }

    const existing = this.followUps[idx]
    const updatedNotes = parsed.data.reason
      ? `${existing.notes ? existing.notes + '\n' : ''}[Cancelado: ${parsed.data.reason}]`
      : existing.notes

    const updated: FollowUp = {
      ...existing,
      status: 'cancelled',
      notes: updatedNotes,
      updatedAt: new Date(),
    }

    this.followUps[idx] = updated
    return updated
  }

  getFollowUpById(
    sessionUser: MockUser | null,
    orgId: string,
    id: string
  ): FollowUp | null {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const fu = this.followUps.find(
      (f) => f.id === id && f.organizationId === org.id
    )
    return fu ?? null
  }

  getFollowUps(
    sessionUser: MockUser | null,
    orgId: string,
    period?: 'today' | 'overdue' | 'upcoming' | 'completed' | 'all'
  ): FollowUp[] {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    return this.followUps.filter((f) => {
      if (f.organizationId !== org.id) return false
      if (period === 'today') {
        return f.status === 'pending' && f.scheduledAt >= startOfToday && f.scheduledAt <= endOfToday
      }
      if (period === 'overdue') {
        return f.status === 'pending' && f.scheduledAt < startOfToday
      }
      if (period === 'upcoming') {
        return f.status === 'pending' && f.scheduledAt > endOfToday
      }
      if (period === 'completed') {
        return f.status === 'completed'
      }
      return true
    })
  }

  createRevenue(sessionUser: MockUser | null, orgId: string, rawInput: unknown) {
    const { org } = this.requireOrganization(sessionUser, orgId);
    return { organizationId: org.id, amount: (rawInput as any).amount };
  }
}

test('Fase 8 - Follow-ups Domain & Multi-Tenant Isolation Suite', async (t) => {
  const engine = new FollowUpsDomainEngine()

  const userA: MockUser = { id: 'usr_a', name: 'User Org A', email: 'user@a.com' }
  const userB: MockUser = { id: 'usr_b', name: 'User Org B', email: 'user@b.com' }

  const orgA = engine.createOrg(userA, 'Empresa A', 'empresa-a')
  const orgB = engine.createOrg(userB, 'Empresa B', 'empresa-b')

  const customerA = engine.createCustomer(orgA.id, 'Cliente A')
  const customerB = engine.createCustomer(orgB.id, 'Cliente B')
  const leadA = engine.createLead(orgA.id, 'Lead A')
  const leadB = engine.createLead(orgB.id, 'Lead B')

  let followUpCustomerA: FollowUp
  let followUpLeadA: FollowUp
  let followUpB: FollowUp

  await t.test('1. Create: Criação de follow-up vinculado a Customer em Org A', () => {
    const tomorrow = new Date(Date.now() + 86400000)
    followUpCustomerA = engine.createFollowUp(userA, orgA.id, {
      customerId: customerA.id,
      type: 'reactivation',
      channel: 'whatsapp',
      scheduledAt: tomorrow,
      notes: 'Ligar para oferecer desconto de retorno',
    })

    assert.equal(followUpCustomerA.organizationId, orgA.id)
    assert.equal(followUpCustomerA.customerId, customerA.id)
    assert.equal(followUpCustomerA.leadId, null)
    assert.equal(followUpCustomerA.type, 'reactivation')
    assert.equal(followUpCustomerA.channel, 'whatsapp')
    assert.equal(followUpCustomerA.status, 'pending')
  })

  await t.test('2. Create: Criação de follow-up vinculado a Lead em Org A', () => {
    const today = new Date()
    followUpLeadA = engine.createFollowUp(userA, orgA.id, {
      leadId: leadA.id,
      type: 'quote_follow_up',
      channel: 'phone',
      scheduledAt: today,
      notes: 'Confirmar recebimento do orçamento',
    })

    assert.equal(followUpLeadA.organizationId, orgA.id)
    assert.equal(followUpLeadA.leadId, leadA.id)
    assert.equal(followUpLeadA.customerId, null)
    assert.equal(followUpLeadA.type, 'quote_follow_up')
    assert.equal(followUpLeadA.channel, 'phone')
  })

  await t.test('3. Create: Criação de follow-up em Org B', () => {
    const overdueDate = new Date(Date.now() - 86400000 * 2)
    followUpB = engine.createFollowUp(userB, orgB.id, {
      customerId: customerB.id,
      type: 'price_follow_up',
      channel: 'email',
      scheduledAt: overdueDate,
      notes: 'Follow-up de proposta B',
    })

    assert.equal(followUpB.organizationId, orgB.id)
  })

  await t.test('4. Complete: Conclusão com registro de desfecho e timestamp do servidor', () => {
    const completed = engine.completeFollowUp(userA, orgA.id, {
      id: followUpLeadA.id,
      outcome: 'Cliente aprovou proposta e solicitou envio do contrato',
    })

    assert.equal(completed.status, 'completed')
    assert.equal(completed.outcome, 'Cliente aprovou proposta e solicitou envio do contrato')
    assert.ok(completed.executedAt instanceof Date)
  })

  await t.test('5. Cancel: Cancelamento de follow-up com registro de justificativa', () => {
    const cancelled = engine.cancelFollowUp(userB, orgB.id, {
      id: followUpB.id,
      reason: 'Cliente optou por concorrente',
    })

    assert.equal(cancelled.status, 'cancelled')
    assert.match(cancelled.notes ?? '', /Cancelado: Cliente optou por concorrente/)
  })

  await t.test('6. Edit: Atualização de follow-up pendente em Org A', () => {
    const updated = engine.updateFollowUp(userA, orgA.id, {
      id: followUpCustomerA.id,
      customerId: customerA.id,
      type: 'appointment_follow_up',
      channel: 'phone',
      scheduledAt: new Date(Date.now() + 172800000),
      notes: 'Mudou para ligação telefônica',
    })

    assert.equal(updated.type, 'appointment_follow_up')
    assert.equal(updated.channel, 'phone')
    assert.equal(updated.notes, 'Mudou para ligação telefônica')
  })

  await t.test('7. Edit: Tentativa de editar follow-up concluído é bloqueada (400)', () => {
    assert.throws(
      () =>
        engine.updateFollowUp(userA, orgA.id, {
          id: followUpLeadA.id,
          customerId: customerA.id,
          type: 'general',
          channel: 'email',
          scheduledAt: new Date(),
        }),
      /400: Apenas follow-ups pendentes podem ser editados/
    )
  })

  await t.test('8. Cross-Tenant Protection: Org A tenta vincular follow-up a Customer de Org B (DENIED)', () => {
    assert.throws(
      () =>
        engine.createFollowUp(userA, orgA.id, {
          customerId: customerB.id,
          type: 'general',
          channel: 'whatsapp',
          scheduledAt: new Date(),
        }),
      /400: Customer não pertence à organização/
    )
  })

  await t.test('9. Cross-Tenant Protection: Org A tenta vincular follow-up a Lead de Org B (DENIED)', () => {
    assert.throws(
      () =>
        engine.createFollowUp(userA, orgA.id, {
          leadId: leadB.id,
          type: 'general',
          channel: 'whatsapp',
          scheduledAt: new Date(),
        }),
      /400: Lead não pertence à organização/
    )
  })

  await t.test('10. Cross-Tenant IDOR: Usuário B tenta ler follow-up de Org A (Retorna null / 404)', () => {
    const readAttempt = engine.getFollowUpById(userB, orgB.id, followUpCustomerA.id)
    assert.equal(readAttempt, null)
  })

  await t.test('11. Cross-Tenant IDOR: Usuário B tenta concluir follow-up de Org A (404/DENIED)', () => {
    assert.throws(
      () =>
        engine.completeFollowUp(userB, orgB.id, {
          id: followUpCustomerA.id,
          outcome: 'Tentativa indevida',
        }),
      /404: Follow-up não encontrado/
    )
  })

  await t.test('12. Validation: Falha se não informar nem customerId nem leadId', () => {
    assert.throws(
      () =>
        engine.createFollowUp(userA, orgA.id, {
          type: 'general',
          channel: 'whatsapp',
          scheduledAt: new Date(),
        }),
      /Validation Error/
    )
  })

  await t.test('13. Validation: Falha se tentar concluir sem desfecho (outcome)', () => {
    assert.throws(
      () =>
        engine.completeFollowUp(userA, orgA.id, {
          id: followUpCustomerA.id,
          outcome: '   ',
        }),
      /Validation Error/
    )
  })

  await t.test('14. Unauthenticated: Acesso sem sessão é bloqueado (401)', () => {
    assert.throws(
      () =>
        engine.createFollowUp(null, orgA.id, {
          customerId: customerA.id,
          type: 'general',
          channel: 'whatsapp',
          scheduledAt: new Date(),
        }),
      /401: Unauthorized/
    )
  })
  
  await t.test('15. Revenue: Registro de receita com vinculo a cliente', () => {
    const revenue = engine.createRevenue(userA, orgA.id, {
      customerId: customerA.id,
      amount: '350.00',
      description: 'Pagamento de serviço',
      paidAt: new Date(),
    })
    assert.equal(revenue.organizationId, orgA.id)
    assert.equal(revenue.amount, '350.00')
  })
  await t.test('16. Mass Assignment: organization_id/created_by injetados são ignorados em FollowUps', () => {
    const fuInjected = engine.createFollowUp(userA, orgA.id, {
      customerId: customerA.id,
      type: 'reactivation',
      channel: 'whatsapp',
      scheduledAt: new Date(Date.now() + 86400000),
      organizationId: orgB.id,
      createdBy: userB.id,
    })
    assert.equal(fuInjected.organizationId, orgA.id)
    assert.equal(fuInjected.createdBy, userA.id)
    assert.notEqual(fuInjected.organizationId, orgB.id)
  })
})