import assert from 'node:assert/strict'
import test from 'node:test'
import { createCustomerSchema, updateCustomerSchema } from '../../src/modules/customers/schemas'
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
 * Motor de domínio e autorização de Customer para teste de isolamento server-side.
 */
class CustomerDomainEngine {
  private organizations = new Map<string, MockOrganization>()
  private memberships: MockMembership[] = []
  private customers: Customer[] = []

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

  requireOrganization(sessionUser: MockUser | null, orgId: string): { org: MockOrganization; user: MockUser } {
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

  createCustomer(
    sessionUser: MockUser | null,
    activeOrgId: string,
    rawInput: unknown
  ): Customer {
    const { org, user } = this.requireOrganization(sessionUser, activeOrgId)
    const parsed = createCustomerSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const now = new Date()
    const newCustomer: Customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: org.id, // SEMPRE do servidor/contexto
      createdBy: user.id,     // SEMPRE do servidor/sessão
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      notes: parsed.data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    }

    this.customers.push(newCustomer)
    return newCustomer
  }

  getCustomerById(
    sessionUser: MockUser | null,
    activeOrgId: string,
    customerId: string
  ): Customer | null {
    const { org } = this.requireOrganization(sessionUser, activeOrgId)
    // Match estrito: ID + organization_id autorizado
    const found = this.customers.find(
      (c) => c.id === customerId && c.organizationId === org.id
    )
    return found ?? null
  }

  listCustomers(
    sessionUser: MockUser | null,
    activeOrgId: string,
    search?: string
  ): Customer[] {
    const { org } = this.requireOrganization(sessionUser, activeOrgId)
    let list = this.customers.filter((c) => c.organizationId === org.id)

    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.phone && c.phone.includes(q))
      )
    }

    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  updateCustomer(
    sessionUser: MockUser | null,
    activeOrgId: string,
    rawInput: unknown
  ): Customer {
    const { org } = this.requireOrganization(sessionUser, activeOrgId)
    const parsed = updateCustomerSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const index = this.customers.findIndex(
      (c) => c.id === parsed.data.id && c.organizationId === org.id
    )

    if (index === -1) {
      throw new Error('404: Not Found - Cliente não encontrado nesta organização')
    }

    const existing = this.customers[index]
    const updated: Customer = {
      ...existing,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      notes: parsed.data.notes ?? null,
      updatedAt: new Date(),
    }

    this.customers[index] = updated
    return updated
  }
}

test('Customer Domain & Multi-Tenant Security Test Suite', async (t) => {
  const engine = new CustomerDomainEngine()

  const userA: MockUser = { id: 'usr_a', name: 'Alice Santos', email: 'alice@empresa-a.com' }
  const userB: MockUser = { id: 'usr_b', name: 'Bob Lima', email: 'bob@empresa-b.com' }

  const orgA = engine.createOrg(userA, 'Empresa A', 'empresa-a')
  const orgB = engine.createOrg(userB, 'Empresa B', 'empresa-b')

  let customerA: Customer
  let customerB: Customer

  await t.test('1. Create: Usuário autenticado cria Customer na Organização A com sucesso', () => {
    customerA = engine.createCustomer(userA, orgA.id, {
      name: 'Carlos Cliente A',
      email: 'carlos@cliente.com',
      phone: '11999998888',
      notes: 'Cliente VIP',
    })

    assert.equal(customerA.name, 'Carlos Cliente A')
    assert.equal(customerA.organizationId, orgA.id)
    assert.equal(customerA.createdBy, userA.id)
    assert.equal(customerA.email, 'carlos@cliente.com')
    assert.equal(customerA.phone, '11999998888')
    assert.equal(customerA.notes, 'Cliente VIP')
    assert.ok(customerA.id)
    assert.ok(customerA.createdAt)
  })

  await t.test('2. Create: Usuário autenticado cria Customer na Organização B com sucesso', () => {
    customerB = engine.createCustomer(userB, orgB.id, {
      name: 'Daniela Cliente B',
      email: 'daniela@cliente.com',
      phone: '21988887777',
      notes: 'Lead inbound',
    })

    assert.equal(customerB.name, 'Daniela Cliente B')
    assert.equal(customerB.organizationId, orgB.id)
    assert.equal(customerB.createdBy, userB.id)
  })

  await t.test('3. Read: Usuário A lê Customer da própria Organização A (PASS)', () => {
    const fetched = engine.getCustomerById(userA, orgA.id, customerA.id)
    assert.ok(fetched)
    assert.equal(fetched.id, customerA.id)
    assert.equal(fetched.name, 'Carlos Cliente A')
  })

  await t.test('4. Update: Usuário A atualiza Customer da própria Organização A (PASS)', () => {
    const updated = engine.updateCustomer(userA, orgA.id, {
      id: customerA.id,
      name: 'Carlos Cliente A Atualizado',
      email: 'carlos.novo@cliente.com',
      phone: '11911112222',
      notes: 'Observação alterada',
    })

    assert.equal(updated.id, customerA.id)
    assert.equal(updated.name, 'Carlos Cliente A Atualizado')
    assert.equal(updated.email, 'carlos.novo@cliente.com')
    assert.equal(updated.notes, 'Observação alterada')
  })

  await t.test('5. Cross-Tenant Read: Usuário A tenta ler Customer B da Organização B (DENIED/404)', () => {
    // Tentativa de acessar diretamente o ID do Customer B na Org A
    const attempt = engine.getCustomerById(userA, orgA.id, customerB.id)
    assert.equal(attempt, null)

    // Tentativa de forjar o header/parâmetro de Org B
    assert.throws(
      () => engine.getCustomerById(userA, orgB.id, customerB.id),
      /403: Forbidden/
    )
  })

  await t.test('6. Cross-Tenant Update (IDOR): Usuário A tenta alterar Customer B da Organização B (DENIED)', () => {
    // Tentativa de forjar update de customerB dentro da Org A
    assert.throws(
      () =>
        engine.updateCustomer(userA, orgA.id, {
          id: customerB.id,
          name: 'Nome Hackeado',
        }),
      /404: Not Found/
    )

    // Verificar que o Customer B não foi corrompido
    const originalB = engine.getCustomerById(userB, orgB.id, customerB.id)
    assert.ok(originalB)
    assert.equal(originalB.name, 'Daniela Cliente B')
  })

  await t.test('7. Cross-Tenant List & Search: Listagem e busca de A nunca expõem dados de B', () => {
    const listA = engine.listCustomers(userA, orgA.id)
    assert.equal(listA.length, 1)
    assert.equal(listA[0].id, customerA.id)

    // Busca que combina com o nome do cliente B
    const searchA = engine.listCustomers(userA, orgA.id, 'Daniela')
    assert.equal(searchA.length, 0)

    // Busca que combina com o nome do cliente A
    const searchA2 = engine.listCustomers(userA, orgA.id, 'Carlos')
    assert.equal(searchA2.length, 1)
    assert.equal(searchA2[0].id, customerA.id)
  })

  await t.test('8. Unauthenticated Access: Usuário sem sessão é bloqueado (DENIED 401)', () => {
    assert.throws(
      () => engine.createCustomer(null, orgA.id, { name: 'Sem Auth' }),
      /401: Unauthorized/
    )
    assert.throws(
      () => engine.getCustomerById(null, orgA.id, customerA.id),
      /401: Unauthorized/
    )
    assert.throws(
      () => engine.updateCustomer(null, orgA.id, { id: customerA.id, name: 'Sem Auth' }),
      /401: Unauthorized/
    )
  })

  await t.test('9. Validation: Zod schemas rejeitam entradas inválidas', () => {
    // Nome vazio
    assert.throws(
      () => engine.createCustomer(userA, orgA.id, { name: '' }),
      /Validation Error/
    )

    // Email inválido
    assert.throws(
      () => engine.createCustomer(userA, orgA.id, { name: 'Teste', email: 'invalido' }),
      /Validation Error/
    )

    // Payload sem ID no update
    assert.throws(
      () => engine.updateCustomer(userA, orgA.id, { name: 'Teste' }),
      /Validation Error/
    )
  })

  await t.test('10. Mass Assignment: Tentativa de injetar organization_id e created_by é neutralizada', () => {
    const maliciousPayload = {
      name: 'Cliente Injeção',
      organizationId: orgB.id,   // Tenta forjar Org B
      createdBy: userB.id,        // Tenta forjar User B
    }

    const created = engine.createCustomer(userA, orgA.id, maliciousPayload)
    // O motor server-side deve atribuir Org A e User A
    assert.equal(created.organizationId, orgA.id)
    assert.equal(created.createdBy, userA.id)
    assert.notEqual(created.organizationId, orgB.id)
    assert.notEqual(created.createdBy, userB.id)
  })
})
