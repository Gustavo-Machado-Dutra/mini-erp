import 'server-only'
import { cookies } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { organizations, organizationMembers } from '@/db/schema/tenancy'
import { getSession } from '@/lib/auth-session'
import { redirect } from 'next/navigation'
import type { TenantContext, UserOrganizationItem } from './types'
import type { MemberRole } from '@/db/schema/tenancy'

export const ACTIVE_ORG_COOKIE_NAME = 'rf_active_org'

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Acesso não autorizado para esta organização', public statusCode: number = 403) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

/**
 * Garante que existe uma sessão ativa válida.
 */
export async function requireSession() {
  const session = await getSession()
  if (!session || !session.user) {
    throw new AuthError('Sessão expirada ou não autenticada', 401)
  }
  return session
}

/**
 * Obtém o ID da organização ativa sugerido pelo cookie.
 */
export async function getActiveOrgIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(ACTIVE_ORG_COOKIE_NAME)?.value || null
}

/**
 * Define a organização ativa no cookie.
 */
export async function setActiveOrganizationCookie(organizationId: string) {
  const cookieStore = await cookies()
  cookieStore.set(ACTIVE_ORG_COOKIE_NAME, organizationId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  })
}

/**
 * Lista todas as organizações das quais o usuário é membro.
 */
export async function getUserOrganizations(userId: string): Promise<UserOrganizationItem[]> {
  const rows = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      role: organizationMembers.role,
      createdAt: organizations.createdAt,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(eq(organizationMembers.userId, userId))

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    role: r.role as MemberRole,
    createdAt: r.createdAt,
  }))
}

/**
 * Helper principal de Tenancy:
 * Valida a sessão, determina o target organizationId (passado explicitamente ou via cookie ou fallback no primeiro membership),
 * e garante que o usuário autenticado pertence àquela organização.
 * NUNCA confia cegamente em IDs fornecidos pelo cliente.
 */
export async function requireOrganization(targetOrgId?: string | null): Promise<TenantContext> {
  const session = await requireSession()
  const userId = session.user.id

  let resolvedOrgId = targetOrgId || (await getActiveOrgIdFromCookie())

  if (!resolvedOrgId) {
    const userOrgs = await getUserOrganizations(userId)
    if (userOrgs.length === 0) {
      throw new NoOrganizationError()
    }
    resolvedOrgId = userOrgs[0].id
  }

  // Consulta atômica verificando membership e dados da organização
  const result = await db
    .select({
      organization: organizations,
      membership: organizationMembers,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(
      and(
        eq(organizationMembers.organizationId, resolvedOrgId),
        eq(organizationMembers.userId, userId)
      )
    )
    .limit(1)

  if (result.length === 0) {
    throw new ForbiddenError('Acesso negado: você não é membro desta organização', 403)
  }

  const { organization, membership } = result[0]

  return {
    organization,
    membership,
    userId,
    role: membership.role as MemberRole,
  }
}

/**
 * Helper para verificar papéis exigidos na organização autorizada.
 */
export async function requireOrganizationRole(
  allowedRoles: MemberRole[],
  targetOrgId?: string | null
): Promise<TenantContext> {
  const context = await requireOrganization(targetOrgId)

  if (!allowedRoles.includes(context.role)) {
    throw new ForbiddenError(
      `Permissão insuficiente. Papel atual: '${context.role}'. Papéis permitidos: ${allowedRoles.join(', ')}`,
      403
    )
  }

  return context
}

export class NoOrganizationError extends ForbiddenError {
  constructor(message: string = 'Usu\u00e1rio n\u00e3o possui nenhuma organiza\u00e7\u00e3o vinculada', public statusCode: number = 403) {
    super(message)
    this.name = 'NoOrganizationError'
  }
}

export async function requireOrganizationForPage(
  targetOrgId?: string | null
): Promise<TenantContext> {
  try {
    return await requireOrganization(targetOrgId)
  } catch (error) {
    if (error instanceof NoOrganizationError) {
      redirect('/organizations/new')
    }
    throw error
  }
}