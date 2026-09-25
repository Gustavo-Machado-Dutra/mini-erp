import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStageSchema,
} from '../../src/modules/leads/schemas'
import type { Lead, LeadStage } from '../../src/db/schema/leads'
import type { Customer } from '../../src/db/schema/customers'

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

/**
 * Motor de domínio e autorização de Leads e Pipeline para testes server-side.
 */
class LeadDomainEngine {
  private organizations = new Map<string, MockOrganization>()
  private memberships: MockMembership[] = []
  private customers: Customer[] = []
  private leads: Lead[] = []

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
    const customer: Customer = {
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
    this.customers.push(customer)
    return customer
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

  createLead(
    sessionUser: MockUser | null,
    activeOrgId: string,
    rawInput: unknown
  ): Lead {
    const { org, user } = this.requireOrganization(sessionUser, activeOrgId)
    const parsed = createLeadSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    // Validar customerId se fornecido
    if (parsed.data.customerId) {
      const cust = this.customers.find(
        (c) => c.id === parsed.data.customerId && c.organizationId === org.id
      )
      if (!cust) {
        throw new Error('400: Cliente vinculado não pertence à organização ativa')
      }
    }

    const now = new Date()
    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: org.id, // SEMPRE do servidor/contexto
      createdBy: user.id,     // SEMPRE do servidor/sessão
      customerId: parsed.data.customerId ?? null,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      source: parsed.data.source ?? null,
      stage: parsed.data.stage ?? 'new',
      notes: parsed.data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    }

    this.leads.push(newLead)
    return newLead
  }

  getLeadById(
    sessionUser: MockUser | null,
    activeOrgId: string,
    leadId: string
  ): Lead | null {
    const { org } = this.requireOrganization(sessionUser, activeOrgId)
    const found = this.leads.find(
      (l) => l.id === leadId && l.organizationId === org.id
    )
    return found ?? null
  }

  listLeads(
    sessionUser: MockUser | null,
    activeOrgId: string,
    filter?: { search?: string; stage?: LeadStage }
  ): Lead[] {
    const { org } = this.requireOrganization(sessionUser, activeOrgId)
    let list = this.leads.filter((l) => l.organizationId === org.id)

    if (filter?.stage) {
      list = list.filter((l) => l.stage === filter.stage)
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.phone && l.phone.includes(q)) ||
          (l.source && l.source.toLowerCase().includes(q))
      )
    }

    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  updateLead(
    sessionUser: MockUser | null,
    activeOrgId: string,
    rawInput: unknown
  ): Lead {
    const { org } = this.requireOrganization(sessionUser, activeOrgId)
    const parsed = updateLeadSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const index = this.leads.findIndex(
      (l) => l.id === parsed.data.id && l.organizationId === org.id
    )

    if (index === -1) {
      throw new Error('404: Not Found - Lead não encontrado nesta organização')
    }

    if (parsed.data.customerId) {
      const cust = this.customers.find(
        (c) => c.id === parsed.data.customerId && c.organizationId === org.id
      )
      if (!cust) {
        throw new Error('400: Cliente vinculado não pertence à organização ativa')
      }
    }

    const existing = this.leads[index]
    const updated: Lead = {
      ...existing,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      source: parsed.data.source ?? null,
      stage: parsed.data.stage,
      customerId: parsed.data.customerId ?? null,
      notes: parsed.data.notes ?? null,
      updatedAt: new Date(),
    }

    this.leads[index] = updated
    return updated
  }

  updateLeadStage(
    sessionUser: MockUser | null,
    activeOrgId: string,
    rawInput: unknown
  ): Lead {
    const { org } = this.requireOrganization(sessionUser, activeOrgId)
    const parsed = updateLeadStageSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const index = this.leads.findIndex(
      (l) => l.id === parsed.data.id && l.organizationId === org.id
    )

    if (index === -1) {
      throw new Error('404: Not Found - Lead não encontrado nesta organização')
    }

    const existing = this.leads[index]
    const updated: Lead = {
      ...existing,
      stage: parsed.data.stage,
      updatedAt: new Date(),
    }

    this.leads[index] = updated
    return updated
  }
}

test('Leads & Pipeline Domain Multi-Tenant Security Suite', async (t) => {
  const engine = new LeadDomainEngine()

  const userA: MockUser = { id: 'usr_a', name: 'Alice Santos', email: 'alice@empresa-a.com' }
  const userB: MockUser = { id: 'usr_b', name: 'Bob Lima', email: 'bob@empresa-b.com' }

  const orgA = engine.createOrg(userA, 'Empresa A', 'empresa-a')
  const orgB = engine.createOrg(userB, 'Empresa B', 'empresa-b')

  const customerA = engine.createCustomer(orgA.id, 'Cliente A da Org A')
  const customerB = engine.createCustomer(orgB.id, 'Cliente B da Org B')

  let leadA: Lead
  let leadB: Lead

  await t.test('1. Create: Usuário autenticado cria Lead na Organização A com sucesso', () => {
    leadA = engine.createLead(userA, orgA.id, {
      name: 'Oportunidade A1',
      email: 'lead.a@email.com',
      phone: '11999990000',
      source: 'Instagram',
      stage: 'new',
      customerId: customerA.id,
      notes: 'Interesse inicial',
    })

    assert.equal(leadA.name, 'Oportunidade A1')
    assert.equal(leadA.organizationId, orgA.id)
    assert.equal(leadA.createdBy, userA.id)
    assert.equal(leadA.customerId, customerA.id)
    assert.equal(leadA.stage, 'new')
    assert.equal(leadA.source, 'Instagram')
    assert.ok(leadA.id)
  })

  await t.test('2. Create: Usuário autenticado cria Lead na Organização B com sucesso', () => {
    leadB = engine.createLead(userB, orgB.id, {
      name: 'Oportunidade B1',
      email: 'lead.b@email.com',
      source: 'Google Ads',
      stage: 'contacted',
      customerId: customerB.id,
    })

    assert.equal(leadB.name, 'Oportunidade B1')
    assert.equal(leadB.organizationId, orgB.id)
    assert.equal(leadB.createdBy, userB.id)
    assert.equal(leadB.customerId, customerB.id)
  })

  await t.test('3. List: Listagem de Leads na Organização A retorna apenas dados de A', () => {
    const listA = engine.listLeads(userA, orgA.id)
    assert.equal(listA.length, 1)
    assert.equal(listA[0].id, leadA.id)

    // Busca por termo de B não retorna nada em A
    const searchA = engine.listLeads(userA, orgA.id, { search: 'Oportunidade B1' })
    assert.equal(searchA.length, 0)
  })

  await t.test('4. Read: Usuário A lê Lead A da própria organização (PASS)', () => {
    const fetched = engine.getLeadById(userA, orgA.id, leadA.id)
    assert.ok(fetched)
    assert.equal(fetched.id, leadA.id)
    assert.equal(fetched.name, 'Oportunidade A1')
  })

  await t.test('5. Update: Usuário A atualiza dados cadastrais do Lead A (PASS)', () => {
    const updated = engine.updateLead(userA, orgA.id, {
      id: leadA.id,
      name: 'Oportunidade A1 Atualizada',
      phone: '11988881111',
      stage: 'contacted',
    })

    assert.equal(updated.id, leadA.id)
    assert.equal(updated.name, 'Oportunidade A1 Atualizada')
    assert.equal(updated.phone, '11988881111')
    assert.equal(updated.stage, 'contacted')
  })

  await t.test('6. Stage Transition: Usuário A altera estágio do Lead A no pipeline (PASS)', () => {
    const transitioned = engine.updateLeadStage(userA, orgA.id, {
      id: leadA.id,
      stage: 'interested',
    })
    assert.equal(transitioned.stage, 'interested')

    const converted = engine.updateLeadStage(userA, orgA.id, {
      id: leadA.id,
      stage: 'converted',
    })
    assert.equal(converted.stage, 'converted')
  })

  await t.test('7. Validation: Zod schemas rejeitam entradas inválidas', () => {
    // Nome vazio
    assert.throws(
      () => engine.createLead(userA, orgA.id, { name: '' }),
      /Validation Error/
    )

    // Email inválido
    assert.throws(
      () => engine.createLead(userA, orgA.id, { name: 'Lead Teste', email: 'invalido' }),
      /Validation Error/
    )

    // Estágio inválido
    assert.throws(
      () => engine.createLead(userA, orgA.id, { name: 'Lead Teste', stage: 'invalid_stage' }),
      /Validation Error/
    )

    // Update sem ID
    assert.throws(
      () => engine.updateLead(userA, orgA.id, { name: 'Lead Teste' }),
      /Validation Error/
    )
  })

  await t.test('8. Unauthenticated Access: Usuário sem sessão é bloqueado (DENIED 401)', () => {
    assert.throws(
      () => engine.createLead(null, orgA.id, { name: 'Lead Sem Auth' }),
      /401: Unauthorized/
    )
    assert.throws(
      () => engine.getLeadById(null, orgA.id, leadA.id),
      /401: Unauthorized/
    )
    assert.throws(
      () => engine.updateLead(null, orgA.id, { id: leadA.id, name: 'Lead Sem Auth' }),
      /401: Unauthorized/
    )
    assert.throws(
      () => engine.updateLeadStage(null, orgA.id, { id: leadA.id, stage: 'lost' }),
      /401: Unauthorized/
    )
  })

  await t.test('9. Cross-Tenant Read: Usuário A tenta ler Lead B da Organização B (DENIED/404)', () => {
    const attempt = engine.getLeadById(userA, orgA.id, leadB.id)
    assert.equal(attempt, null)

    assert.throws(
      () => engine.getLeadById(userA, orgB.id, leadB.id),
      /403: Forbidden/
    )
  })

  await t.test('10. Cross-Tenant Update (IDOR): Usuário A tenta alterar Lead B da Org B (DENIED 404)', () => {
    assert.throws(
      () =>
        engine.updateLead(userA, orgA.id, {
          id: leadB.id,
          name: 'Nome Hackeado',
        }),
      /404: Not Found/
    )

    assert.throws(
      () =>
        engine.updateLeadStage(userA, orgA.id, {
          id: leadB.id,
          stage: 'lost',
        }),
      /404: Not Found/
    )

    // Verificar integridade do Lead B
    const originalB = engine.getLeadById(userB, orgB.id, leadB.id)
    assert.ok(originalB)
    assert.equal(originalB.name, 'Oportunidade B1')
  })

  await t.test('11. Cross-Tenant Customer Link: Usuário A tenta associar Lead A a Customer B de Org B (DENIED)', () => {
    // Criação com Customer de outra organização
    assert.throws(
      () =>
        engine.createLead(userA, orgA.id, {
          name: 'Lead Cross Tenant Customer',
          customerId: customerB.id,
        }),
      /Cliente vinculado não pertence/
    )

    // Atualização com Customer de outra organização
    assert.throws(
      () =>
        engine.updateLead(userA, orgA.id, {
          id: leadA.id,
          name: leadA.name,
          customerId: customerB.id,
        }),
      /Cliente vinculado não pertence/
    )
  })

  await t.test('12. Mass Assignment: Tentativa de injetar organization_id ou created_by é neutralizada', () => {
    const maliciousPayload = {
      name: 'Lead Mass Assignment',
      organizationId: orgB.id, // Forjando Org B
      createdBy: userB.id,      // Forjando User B
    }

    const created = engine.createLead(userA, orgA.id, maliciousPayload)
    assert.equal(created.organizationId, orgA.id)
    assert.equal(created.createdBy, userA.id)
    assert.notEqual(created.organizationId, orgB.id)
    assert.notEqual(created.createdBy, userB.id)
  })
})