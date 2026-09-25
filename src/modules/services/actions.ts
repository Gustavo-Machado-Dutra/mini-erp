'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { services } from '@/db/schema/services'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import {
  createServiceSchema,
  updateServiceSchema,
  type CreateServiceInput,
  type UpdateServiceInput,
} from './schemas'
import type { ActionResult, Service } from './types'

export async function createServiceAction(
  rawInput: CreateServiceInput
): Promise<ActionResult<Service>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = createServiceSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { name, description, durationMinutes, price, active } = parsed.data

    const [newService] = await db
      .insert(services)
      .values({
        organizationId: orgId,
        createdBy: session.user.id,
        name,
        description,
        durationMinutes,
        price,
        active: active ?? true,
      })
      .returning()

    revalidatePath('/services')
    revalidatePath('/appointments/new')
    return { success: true, data: newService }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao criar serviço' }
  }
}

export async function updateServiceAction(
  rawInput: UpdateServiceInput
): Promise<ActionResult<Service>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = updateServiceSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { id, name, description, durationMinutes, price, active } = parsed.data

    const [existing] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, id), eq(services.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Serviço não encontrado', statusCode: 404 }
    }

    const [updated] = await db
      .update(services)
      .set({
        name,
        description,
        durationMinutes,
        price,
        active,
        updatedAt: new Date(),
      })
      .where(and(eq(services.id, id), eq(services.organizationId, orgId)))
      .returning()

    revalidatePath('/services')
    revalidatePath(`/services/${id}`)
    revalidatePath(`/services/${id}/edit`)
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar serviço' }
  }
}

export async function toggleServiceActiveAction(
  id: string,
  active: boolean
): Promise<ActionResult<Service>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const [existing] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, id), eq(services.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Serviço não encontrado', statusCode: 404 }
    }

    const [updated] = await db
      .update(services)
      .set({ active, updatedAt: new Date() })
      .where(and(eq(services.id, id), eq(services.organizationId, orgId)))
      .returning()

    revalidatePath('/services')
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro ao alterar status do serviço' }
  }
}