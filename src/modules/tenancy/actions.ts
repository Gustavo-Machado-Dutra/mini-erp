'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { organizations, organizationMembers } from '@/db/schema/tenancy'
import { eq } from 'drizzle-orm'
import {
  requireSession,
  requireOrganization,
  getUserOrganizations,
  setActiveOrganizationCookie,
  ForbiddenError,
} from './context'
import {
  createOrganizationSchema,
  switchOrganizationSchema,
  type CreateOrganizationInput,
  type UserOrganizationItem,
} from './types'

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number }

/**
 * Server Action para criação de organização.
 * Executada com autenticação obrigatória, validação Zod e criação do membership inicial como 'owner'.
 */
export async function createOrganizationAction(
  rawInput: CreateOrganizationInput
): Promise<ActionResult<{ organizationId: string; slug: string }>> {
  try {
    const session = await requireSession()
    const userId = session.user.id

    const parsed = createOrganizationSchema.safeParse(rawInput)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Dados inválidos',
        statusCode: 400,
      }
    }

    const { name, slug } = parsed.data

    // Verificar se slug já existe
    const existing = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1)

    if (existing.length > 0) {
      return {
        success: false,
        error: 'Uma organização com este slug já existe. Escolha outro.',
        statusCode: 409,
      }
    }

    // Criar organização e membership atomicamente
    const [newOrg] = await db
      .insert(organizations)
      .values({
        name,
        slug,
      })
      .returning()

    await db.insert(organizationMembers).values({
      organizationId: newOrg.id,
      userId,
      role: 'owner',
    })

    // Define a nova organização como ativa no cookie
    await setActiveOrganizationCookie(newOrg.id)

    revalidatePath('/', 'layout')

    return {
      success: true,
      data: {
        organizationId: newOrg.id,
        slug: newOrg.slug,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao criar organização' }
  }
}

/**
 * Server Action para alternar a organização ativa.
 * Valida membership no banco antes de gravar o cookie.
 */
export async function switchOrganizationAction(
  organizationId: string
): Promise<ActionResult<{ activeOrgId: string }>> {
  try {
    const parsed = switchOrganizationSchema.safeParse({ organizationId })
    if (!parsed.success) {
      return { success: false, error: 'ID de organização inválido', statusCode: 400 }
    }

    // Valida se o usuário autenticado realmente é membro da organização
    await requireOrganization(parsed.data.organizationId)

    // Atualiza o cookie de tenant ativo
    await setActiveOrganizationCookie(parsed.data.organizationId)

    revalidatePath('/', 'layout')

    return {
      success: true,
      data: { activeOrgId: parsed.data.organizationId },
    }
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: 403 }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro ao alternar organização' }
  }
}

/**
 * Server Action para obter lista de organizações do usuário autenticado.
 */
export async function getUserOrganizationsAction(): Promise<ActionResult<UserOrganizationItem[]>> {
  try {
    const session = await requireSession()
    const list = await getUserOrganizations(session.user.id)
    return { success: true, data: list }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro ao listar organizações' }
  }
}