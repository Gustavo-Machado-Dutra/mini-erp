'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { leads } from '@/db/schema/leads'
import { customers } from '@/db/schema/customers'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStageSchema,
  type CreateLeadInput,
  type UpdateLeadInput,
  type UpdateLeadStageInput,
} from './schemas'
import type { ActionResult, Lead } from './types'

/**
 * Cria um novo Lead garantindo validação de sessão, tenant scoping e membership.
 * Se informado customerId, valida atomicamente se o Customer pertence à organização ativa.
 */
export async function createLeadAction(
  rawInput: CreateLeadInput
): Promise<ActionResult<Lead>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = createLeadSchema.safeParse(rawInput)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Dados inválidos'
      return { success: false, error: firstError, statusCode: 400 }
    }

    const { name, email, phone, source, stage, customerId, notes } = parsed.data

    // Validar se customerId informado realmente pertence à organização ativa
    if (customerId) {
      const [existingCustomer] = await db
        .select({ id: customers.id })
        .from(customers)
        .where(and(eq(customers.id, customerId), eq(customers.organizationId, orgId)))
        .limit(1)

      if (!existingCustomer) {
        return {
          success: false,
          error: 'O cliente selecionado não pertence à sua organização ativa',
          statusCode: 400,
        }
      }
    }

    const [newLead] = await db
      .insert(leads)
      .values({
        organizationId: orgId,
        createdBy: session.user.id,
        name,
        email,
        phone,
        source,
        stage: stage ?? 'new',
        customerId,
        notes,
      })
      .returning()

    revalidatePath('/leads')
    return { success: true, data: newLead }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao criar lead' }
  }
}

/**
 * Atualiza um lead existente pertencente à organização ativa.
 * Previne IDOR e associação indevida a customer de outro tenant.
 */
export async function updateLeadAction(
  rawInput: UpdateLeadInput
): Promise<ActionResult<Lead>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = updateLeadSchema.safeParse(rawInput)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Dados inválidos'
      return { success: false, error: firstError, statusCode: 400 }
    }

    const { id, name, email, phone, source, stage, customerId, notes } = parsed.data

    // Verificar se o lead existe nesta organização
    const [existingLead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(and(eq(leads.id, id), eq(leads.organizationId, orgId)))
      .limit(1)

    if (!existingLead) {
      return {
        success: false,
        error: 'Lead não encontrado nesta organização',
        statusCode: 404,
      }
    }

    // Validar se customerId pertence à organização ativa
    if (customerId) {
      const [existingCustomer] = await db
        .select({ id: customers.id })
        .from(customers)
        .where(and(eq(customers.id, customerId), eq(customers.organizationId, orgId)))
        .limit(1)

      if (!existingCustomer) {
        return {
          success: false,
          error: 'O cliente selecionado não pertence à sua organização ativa',
          statusCode: 400,
        }
      }
    }

    const [updatedLead] = await db
      .update(leads)
      .set({
        name,
        email,
        phone,
        source,
        stage,
        customerId,
        notes,
        updatedAt: new Date(),
      })
      .where(and(eq(leads.id, id), eq(leads.organizationId, orgId)))
      .returning()

    revalidatePath('/leads')
    revalidatePath(`/leads/${id}`)
    revalidatePath(`/leads/${id}/edit`)
    return { success: true, data: updatedLead }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar lead' }
  }
}

/**
 * Atualiza rapidamente o estágio de um lead no pipeline.
 */
export async function updateLeadStageAction(
  rawInput: UpdateLeadStageInput
): Promise<ActionResult<Lead>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = updateLeadStageSchema.safeParse(rawInput)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Estágio inválido'
      return { success: false, error: firstError, statusCode: 400 }
    }

    const { id, stage } = parsed.data

    const [existingLead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(and(eq(leads.id, id), eq(leads.organizationId, orgId)))
      .limit(1)

    if (!existingLead) {
      return {
        success: false,
        error: 'Lead não encontrado nesta organização',
        statusCode: 404,
      }
    }

    const [updatedLead] = await db
      .update(leads)
      .set({
        stage,
        updatedAt: new Date(),
      })
      .where(and(eq(leads.id, id), eq(leads.organizationId, orgId)))
      .returning()

    revalidatePath('/leads')
    revalidatePath(`/leads/${id}`)
    return { success: true, data: updatedLead }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao alterar estágio do lead' }
  }
}