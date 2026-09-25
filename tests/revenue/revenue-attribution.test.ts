import assert from 'node:assert/strict'
import test from 'node:test'
import { createRevenueSchema } from '../../src/modules/revenue/schemas'
import { isRecoveredAttributionType } from '../../src/modules/conversions/types'
import type { Customer } from '../../src/db/schema/customers'

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

interface MockConversion {
  id: string
  organizationId: string
  attributionType: string
}

interface MockRevenue {
  id: string
  organizationId: string
  customerId: string
  conversionId: string | null
  amount: string
  currency: string
  source: string
  status: string
  occurredAt: Date
}

class RevenueDomainEngine {
  private organizations = new Map<string, { id: string; name: string; slug: string }>()
  private memberships: MockMembership[] = []
  private customers: Customer[] = []
  private conversions: MockConversion[] = []
  private revenue: MockRevenue[] = []

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

  createConversion(orgId: string, attributionType: string): MockConversion {
    const conv = { id: `conv_${this.conversions.length + 1}`, organizationId: orgId, attributionType }
    this.conversions.push(conv)
    return conv
  }

  requireOrganization(sessionUser: MockUser | null, orgId: string) {
    if (!sessionUser) throw new Error('401: Unauthorized')
    const org = this.organizations.get(orgId)
    if (!org) throw new Error('404: Organização não encontrada')
    const membership = this.memberships.find((m) => m.organizationId === orgId && m.userId === sessionUser.id)
    if (!membership) throw new Error('403: Forbidden - Usuário não pertence a esta organização')
    return { org, user: sessionUser }
  }

  createRevenue(sessionUser: MockUser | null, orgId: string, rawInput: unknown) {
    const { org, user } = this.requireOrganization(sessionUser, orgId)
    const parsed = createRevenueSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const cust = this.customers.find((c) => c.id === parsed.data.customerId && c.organizationId === org.id)
    if (!cust) throw new Error('400: Cliente não pertence à organização')

    if (parsed.data.conversionId) {
      const conv = this.conversions.find((c) => c.id === parsed.data.conversionId && c.organizationId === org.id)
      if (!conv) throw new Error('400: Conversão não pertence à organização')
    }

    const item: MockRevenue = {
      id: `rv_${this.revenue.length + 1}`,
      organizationId: org.id,
      customerId: parsed.data.customerId,
      conversionId: parsed.data.conversionId,
      amount: parsed.data.amount.toFixed(2),
      currency: parsed.data.currency,
      source: parsed.data.source,
      status: parsed.data.status,
      occurredAt: parsed.data.occurredAt,
    }
    this.revenue.push(item)
    return item
  }

  getById(id: string, orgId: string) {
    const item = this.revenue.find((r) => r.id === id)
    if (!item || item.organizationId !== orgId) return null
    return item
  }

  listRevenue() {
    return [...this.revenue]
  }

  getConversion(id: string) {
    return this.conversions.find((c) => c.id === id) ?? null
  }

  isRecovered(id: string) {
    const item = this.revenue.find((r) => r.id === id)
    if (!item) return false
    if (!item.conversionId) return false
    const conv = this.conversions.find((c) => c.id === item.conversionId)
    if (!conv || conv.organizationId !== item.organizationId) return false
    return isRecoveredAttributionType(conv.attributionType as never)
  }
}

test('Revenue Domain, Attribution & Multi-Tenant Security Suite', async (t) => {
  const engine = new RevenueDomainEngine()
  const userA: MockUser = { id: 'u_a', name: 'A', email: 'a@a.com' }
  const userB: MockUser = { id: 'u_b', name: 'B', email: 'b@b.com' }
  const orgA = engine.createOrg(userA, 'org_a')
  const orgB = engine.createOrg(userB, 'org_b')

  const customerA = engine.createCustomer(orgA.id, 'Cliente A')
  const customerB = engine.createCustomer(orgB.id, 'Cliente B')

  const followUpConv = engine.createConversion(orgA.id, 'follow_up_conversion')
  const reactivationConv = engine.createConversion(orgA.id, 'reactivation_conversion')
  const manualConv = engine.createConversion(orgA.id, 'manual_conversion')
  const directConv = engine.createConversion(orgA.id, 'direct_conversion')
  const unknownConv = engine.createConversion(orgA.id, 'unknown')

  await t.test('1. Create: Receita registrada com sucesso e usa decimal (numeric)', () => {
    const rev = engine.createRevenue(userA, orgA.id, {
      customerId: customerA.id,
      amount: 500.5,
      occurredAt: new Date(),
    })
    assert.equal(rev.amount, '500.50')
    assert.equal(rev.currency, 'BRL')
    assert.equal(rev.source, 'manual')
    assert.equal(rev.status, 'recorded')
  })

  await t.test('2. Receita sem conversão NÃO é recuperada', () => {
    const rev = engine.createRevenue(userA, orgA.id, { customerId: customerA.id, amount: 100, occurredAt: new Date() })
    assert.equal(engine.isRecovered(rev.id), false)
  })

  await t.test('3. Receita com conversão follow_up é recuperada', () => {
    const rev = engine.createRevenue(userA, orgA.id, {
      customerId: customerA.id,
      conversionId: followUpConv.id,
      amount: 200,
      occurredAt: new Date(),
    })
    assert.equal(engine.isRecovered(rev.id), true)
  })

  await t.test('4. Receita com conversão reactivation é recuperada', () => {
    const rev = engine.createRevenue(userA, orgA.id, {
      customerId: customerA.id,
      conversionId: reactivationConv.id,
      amount: 300,
      occurredAt: new Date(),
    })
    assert.equal(engine.isRecovered(rev.id), true)
  })

  await t.test('5. Receita com conversão manual/direct/unknown NÃO é recuperada', () => {
    for (const conv of [manualConv, directConv, unknownConv]) {
      const rev = engine.createRevenue(userA, orgA.id, {
        customerId: customerA.id,
        conversionId: conv.id,
        amount: 50,
        occurredAt: new Date(),
      })
      assert.equal(engine.isRecovered(rev.id), false, `conversão ${conv.attributionType} não deve contar como recuperada`)
    }
  })

  await t.test('6. Regra: receita registrada não é automaticamente receita recuperada', () => {
    const registered = engine.listRevenue().filter((r) => r.organizationId === orgA.id).length
    const recovered = engine.listRevenue().filter((r) => engine.isRecovered(r.id)).length
    assert.ok(registered > recovered)
    assert.equal(recovered, 2) // apenas follow_up + reactivation
  })

  await t.test('7. Cross-Tenant: Org A não registra receita para Cliente da Org B', () => {
    assert.throws(
      () => engine.createRevenue(userA, orgA.id, { customerId: customerB.id, amount: 100, occurredAt: new Date() }),
      /Cliente não pertence à organização/
    )
  })

  await t.test('8. Cross-Tenant: Org A não vincula conversão da Org B', () => {
    const convB = engine.createConversion(orgB.id, 'follow_up_conversion')
    assert.throws(
      () => engine.createRevenue(userA, orgA.id, { customerId: customerA.id, conversionId: convB.id, amount: 100, occurredAt: new Date() }),
      /Conversão não pertence à organização/
    )
  })

  await t.test('9. Validation: Rejeita valor zero ou negativo', () => {
    assert.throws(
      () => engine.createRevenue(userA, orgA.id, { customerId: customerA.id, amount: 0, occurredAt: new Date() }),
      /maior que zero/
    )
  })

  await t.test('10. Validation: Rejeita source inválido', () => {
    const parsed = createRevenueSchema.safeParse({
      customerId: customerA.id,
      amount: 10,
      source: 'nope',
      occurredAt: new Date(),
    })
    assert.equal(parsed.success, false)
  })

  await t.test('11. Unauthenticated: Acesso sem sessão é bloqueado', () => {
    assert.throws(() => engine.createRevenue(null, orgA.id, { customerId: customerA.id, amount: 10, occurredAt: new Date() }), /401/)
  })

  await t.test('12. Mass Assignment: organization_id/created_by são ignorados pelo schema', () => {
    const parsed = createRevenueSchema.safeParse({
      customerId: customerA.id,
      amount: 10,
      occurredAt: new Date(),
      organizationId: orgB.id,
      createdBy: 'hacker',
    })
    assert.equal(parsed.success, true)
    const data = parsed.data as any
    assert.equal(data.organizationId, undefined)
    assert.equal(data.createdBy, undefined)
  })

  await t.test('13. Cross-Tenant IDOR: Usuário B não lê receita da Org A', () => {
    const rev = engine.createRevenue(userA, orgA.id, { customerId: customerA.id, amount: 77, occurredAt: new Date() })
    assert.equal(engine.getById(rev.id, orgB.id), null)
    assert.notEqual(engine.getById(rev.id, orgA.id), null)
  })

  await t.test('14. Relação Conversion → Revenue: vínculo preserva conversão e organização', () => {
    const conv = engine.createConversion(orgA.id, 'follow_up_conversion')
    const rev = engine.createRevenue(userA, orgA.id, {
      customerId: customerA.id,
      conversionId: conv.id,
      amount: 420,
      occurredAt: new Date(),
    })
    assert.equal(rev.organizationId, orgA.id)
    assert.equal(rev.conversionId, conv.id)
    const linkedConv = engine.getConversion(rev.conversionId!)
    assert.equal(linkedConv?.organizationId, rev.organizationId)
    assert.equal(engine.isRecovered(rev.id), true)
  })
})
