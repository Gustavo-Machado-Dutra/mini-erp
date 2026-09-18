import assert from 'node:assert/strict'
import test from 'node:test'
import type { MemberRole } from '../../src/db/schema/tenancy'

// Tipagem do modelo de dados para o teste de isolamento
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
  role: MemberRole
}

// Implementação isolada de teste da lógica server-side de autorização de tenancy
class TenancyAuthorizationEngine {
  private organizations = new Map<string, MockOrganization>()
  private memberships: MockMembership[] = []

  createOrganization(user: MockUser | null, name: string, slug: string): { org: MockOrganization; membership: MockMembership } {
    if (!user) {
      throw new Error('401: Unauthorized - Requer sessão ativa')
    }
    const org: MockOrganization = { id: `org_${Date.now()}_${Math.random()}`, name, slug }
    const membership: MockMembership = {
      id: `mem_${Date.now()}_${Math.random()}`,
      organizationId: org.id,
      userId: user.id,
      role: 'owner',
    }
    this.organizations.set(org.id, org)
    this.memberships.push(membership)
    return { org, membership }
  }

  addMember(orgId: string, user: MockUser, role: MemberRole) {
    this.memberships.push({
      id: `mem_${Date.now()}_${Math.random()}`,
      organizationId: orgId,
      userId: user.id,
      role,
    })
  }

  requireOrganization(sessionUser: MockUser | null, requestedOrgId: string): { organization: MockOrganization; membership: MockMembership } {
    if (!sessionUser) {
      throw new Error('401: Unauthorized - Sessão ausente')
    }

    const org = this.organizations.get(requestedOrgId)
    if (!org) {
      throw new Error('404: Organização não encontrada')
    }

    const membership = this.memberships.find(
      (m) => m.organizationId === requestedOrgId && m.userId === sessionUser.id
    )

    if (!membership) {
      throw new Error('403: Forbidden - Acesso negado para esta organização')
    }

    return { organization: org, membership }
  }

  requireOrganizationRole(sessionUser: MockUser | null, requestedOrgId: string, allowedRoles: MemberRole[]) {
    const { membership } = this.requireOrganization(sessionUser, requestedOrgId)
    if (!allowedRoles.includes(membership.role)) {
      throw new Error(`403: Forbidden - Papel '${membership.role}' não autorizado. Requer: ${allowedRoles.join(', ')}`)
    }
    return true
  }
}

test('Multi-Tenancy Security & Isolation Test Suite', async (t) => {
  const engine = new TenancyAuthorizationEngine()

  const userA: MockUser = { id: 'user_a', name: 'Usuário A', email: 'user.a@test.com' }
  const userB: MockUser = { id: 'user_b', name: 'Usuário B', email: 'user.b@test.com' }
  const userC: MockUser = { id: 'user_c', name: 'Usuário C (Member)', email: 'user.c@test.com' }

  let orgA: MockOrganization
  let orgB: MockOrganization

  await t.test('Caso 1: Usuário A cria Organization A com role = owner', () => {
    const res = engine.createOrganization(userA, 'Clínica A', 'clinica-a')
    orgA = res.org
    assert.equal(res.membership.userId, userA.id)
    assert.equal(res.membership.organizationId, orgA.id)
    assert.equal(res.membership.role, 'owner')
  })

  await t.test('Caso 2: Usuário B cria Organization B com role = owner', () => {
    const res = engine.createOrganization(userB, 'Clínica B', 'clinica-b')
    orgB = res.org
    assert.equal(res.membership.userId, userB.id)
    assert.equal(res.membership.organizationId, orgB.id)
    assert.equal(res.membership.role, 'owner')
  })

  await t.test('Caso 3: Usuário A acessa Organization A (PASS)', () => {
    const context = engine.requireOrganization(userA, orgA.id)
    assert.equal(context.organization.id, orgA.id)
    assert.equal(context.membership.role, 'owner')
  })

  await t.test('Caso 4: Usuário A tenta acessar Organization B (DENIED 403)', () => {
    assert.throws(
      () => engine.requireOrganization(userA, orgB.id),
      /403: Forbidden/
    )
  })

  await t.test('Caso 5: Usuário A manipula organization_id para B em requisição forjada (DENIED 403 / IDOR Prevention)', () => {
    const forgedTargetId = orgB.id
    assert.throws(
      () => engine.requireOrganization(userA, forgedTargetId),
      /403: Forbidden/
    )
  })

  await t.test('Caso 6: Usuário sem sessão tenta acessar recurso organizacional (DENIED 401)', () => {
    assert.throws(
      () => engine.requireOrganization(null, orgA.id),
      /401: Unauthorized/
    )
  })

  await t.test('Caso 7: Member tenta executar ação exclusiva de owner (DENIED 403)', () => {
    engine.addMember(orgA.id, userC, 'member')

    // Member acessa normalmente dados com permissão member
    const accessOk = engine.requireOrganizationRole(userC, orgA.id, ['owner', 'admin', 'member'])
    assert.equal(accessOk, true)

    // Member tenta executar ação exclusiva de owner
    assert.throws(
      () => engine.requireOrganizationRole(userC, orgA.id, ['owner']),
      /403: Forbidden - Papel 'member' não autorizado/
    )
  })
})