'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { followUps } from '@/db/schema/follow-ups'
import { customers } from '@/db/schema/customers'
import { leads } from '@/db/schema/leads'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import {
  createFollowUpSchema,
  updateFollowUpSchema,
  completeFollowUpSchema,
  cancelFollowUpSchema,
  type CreateFollowUpInput,
  type UpdateFollowUpInput,
  type CompleteFollowUpInput,
  type CancelFollowUpInput,
} from './schemas'
import type { ActionResult, FollowUp } from './types'

export async function createFollowUpAction(
  rawInput: CreateFollowUpInput
): Promise<ActionResult<FollowUp>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = createFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { customerId, leadId, type, channel, scheduledAt, notes } = parsed.data

    // Validar se Customer pertence à organização ativa
    if (customerId) {
      const [cust] = await db
        .select({ id: customers.id })
        .from(customers)
        .where(and(eq(customers.id, customerId), eq(customers.organizationId, orgId)))
        .limit(1)
      if (!cust) {
        return { success: false, error: 'O cliente vinculado não pertence à sua organização', statusCode: 400 }
      }
    }

    // Validar se Lead pertence à organização ativa
    if (leadId) {
      const [ld] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(and(eq(leads.id, leadId), eq(leads.organizationId, orgId)))
        .limit(1)
      if (!ld) {
        return { success: false, error: 'O lead vinculado não pertence à sua organização', statusCode: 400 }
      }
    }

    const [newFollowUp] = await db
      .insert(followUps)
      .values({
        organizationId: orgId,
        createdBy: session.user.id,
        customerId,
        leadId,
        type,
        channel,
        scheduledAt,
        status: 'pending',
        notes,
      })
      .returning()

    revalidatePath('/follow-ups')
    return { success: true, data: newFollowUp }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao criar follow-up' }
  }
}

export async function updateFollowUpAction(
  rawInput: UpdateFollowUpInput
): Promise<ActionResult<FollowUp>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = updateFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { id, customerId, leadId, type, channel, scheduledAt, notes } = parsed.data

    const [existing] = await db
      .select({ id: followUps.id, status: followUps.status })
      .from(followUps)
      .where(and(eq(followUps.id, id), eq(followUps.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Follow-up não encontrado', statusCode: 404 }
    }

    if (existing.status !== 'pending') {
      return { success: false, error: 'Apenas follow-ups pendentes podem ser editados', statusCode: 400 }
    }

    if (customerId) {
      const [cust] = await db
        .select({ id: customers.id })
        .from(customers)
        .where(and(eq(customers.id, customerId), eq(customers.organizationId, orgId)))
        .limit(1)
      if (!cust) return { success: false, error: 'Cliente inválido', statusCode: 400 }
    }

    if (leadId) {
      const [ld] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(and(eq(leads.id, leadId), eq(leads.organizationId, orgId)))
        .limit(1)
      if (!ld) return { success: false, error: 'Lead inválido', statusCode: 400 }
    }

    const [updated] = await db
      .update(followUps)
      .set({
        customerId,
        leadId,
        type,
        channel,
        scheduledAt,
        notes,
        updatedAt: new Date(),
      })
      .where(and(eq(followUps.id, id), eq(followUps.organizationId, orgId)))
      .returning()

    revalidatePath('/follow-ups')
    revalidatePath(`/follow-ups/${id}`)
    revalidatePath(`/follow-ups/${id}/edit`)
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar follow-up' }
  }
}

export async function completeFollowUpAction(
  rawInput: CompleteFollowUpInput
): Promise<ActionResult<FollowUp>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = completeFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Desfecho obrigatório', statusCode: 400 }
    }

    const { id, outcome } = parsed.data

    const [existing] = await db
      .select({ id: followUps.id })
      .from(followUps)
      .where(and(eq(followUps.id, id), eq(followUps.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Follow-up não encontrado', statusCode: 404 }
    }

    const [updated] = await db
      .update(followUps)
      .set({
        status: 'completed',
        executedAt: new Date(),
        outcome,
        updatedAt: new Date(),
      })
      .where(and(eq(followUps.id, id), eq(followUps.organizationId, orgId)))
      .returning()

    revalidatePath('/follow-ups')
    revalidatePath(`/follow-ups/${id}`)
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro ao concluir follow-up' }
  }
}

export async function cancelFollowUpAction(
  rawInput: CancelFollowUpInput
): Promise<ActionResult<FollowUp>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = cancelFollowUpSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: 'Dados inválidos', statusCode: 400 }
    }

    const { id, reason } = parsed.data

    const [existing] = await db
      .select({ id: followUps.id, notes: followUps.notes })
      .from(followUps)
      .where(and(eq(followUps.id, id), eq(followUps.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Follow-up não encontrado', statusCode: 404 }
    }

    const updatedNotes = reason
      ? `${existing.notes ? existing.notes + '\n' : ''}[Cancelado: ${reason}]`
      : existing.notes

    const [updated] = await db
      .update(followUps)
      .set({
        status: 'cancelled',
        notes: updatedNotes,
        updatedAt: new Date(),
      })
      .where(and(eq(followUps.id, id), eq(followUps.organizationId, orgId)))
      .returning()

    revalidatePath('/follow-ups')
    revalidatePath(`/follow-ups/${id}`)
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro ao cancelar follow-up' }
  }
}