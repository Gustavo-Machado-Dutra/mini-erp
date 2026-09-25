'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { professionals } from '@/db/schema/professionals'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import {
  createProfessionalSchema,
  updateProfessionalSchema,
  type CreateProfessionalInput,
  type UpdateProfessionalInput,
} from './schemas'
import type { ActionResult, Professional } from './types'

export async function createProfessionalAction(
  rawInput: CreateProfessionalInput
): Promise<ActionResult<Professional>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = createProfessionalSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { name, email, phone, active } = parsed.data

    const [newProf] = await db
      .insert(professionals)
      .values({
        organizationId: orgId,
        createdBy: session.user.id,
        name,
        email,
        phone,
        active: active ?? true,
      })
      .returning()

    revalidatePath('/professionals')
    revalidatePath('/appointments/new')
    return { success: true, data: newProf }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao criar profissional' }
  }
}

export async function updateProfessionalAction(
  rawInput: UpdateProfessionalInput
): Promise<ActionResult<Professional>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = updateProfessionalSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { id, name, email, phone, active } = parsed.data

    const [existing] = await db
      .select({ id: professionals.id })
      .from(professionals)
      .where(and(eq(professionals.id, id), eq(professionals.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Profissional não encontrado', statusCode: 404 }
    }

    const [updated] = await db
      .update(professionals)
      .set({
        name,
        email,
        phone,
        active,
        updatedAt: new Date(),
      })
      .where(and(eq(professionals.id, id), eq(professionals.organizationId, orgId)))
      .returning()

    revalidatePath('/professionals')
    revalidatePath(`/professionals/${id}`)
    revalidatePath(`/professionals/${id}/edit`)
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar profissional' }
  }
}

export async function toggleProfessionalActiveAction(
  id: string,
  active: boolean
): Promise<ActionResult<Professional>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const [existing] = await db
      .select({ id: professionals.id })
      .from(professionals)
      .where(and(eq(professionals.id, id), eq(professionals.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Profissional não encontrado', statusCode: 404 }
    }

    const [updated] = await db
      .update(professionals)
      .set({ active, updatedAt: new Date() })
      .where(and(eq(professionals.id, id), eq(professionals.organizationId, orgId)))
      .returning()

    revalidatePath('/professionals')
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro ao alterar status do profissional' }
  }
}