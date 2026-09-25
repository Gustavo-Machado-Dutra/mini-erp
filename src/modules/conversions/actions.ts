'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { conversions } from '@/db/schema/conversions'
import { leads } from '@/db/schema/leads'
import { customers } from '@/db/schema/customers'
import { appointments } from '@/db/schema/appointments'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import { createConversionSchema, type CreateConversionInput } from './schemas'
import type { ActionResult, Conversion } from './types'

export async function createConversionAction(
  rawInput: CreateConversionInput
): Promise<ActionResult<Conversion>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = createConversionSchema.safeParse(rawInput)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Dados inválidos',
        statusCode: 400,
      }
    }

    const { customerId, leadId, appointmentId, attributionType, convertedAt, notes } = parsed.data

    // Validação multi-tenant: todas as entidades vinculadas devem pertencer à organização ativa
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

    if (leadId) {
      const [lead] = await db
        .select({ id: leads.id, organizationId: leads.organizationId })
        .from(leads)
        .where(and(eq(leads.id, leadId), eq(leads.organizationId, orgId)))
        .limit(1)
      if (!lead) {
        return { success: false, error: 'O lead vinculado não pertence à sua organização', statusCode: 400 }
      }
    }

    if (appointmentId) {
      const [appt] = await db
        .select({ id: appointments.id })
        .from(appointments)
        .where(and(eq(appointments.id, appointmentId), eq(appointments.organizationId, orgId)))
        .limit(1)
      if (!appt) {
        return { success: false, error: 'O agendamento vinculado não pertence à sua organização', statusCode: 400 }
      }
    }

    const [newConversion] = await db
      .insert(conversions)
      .values({
        organizationId: orgId,
        createdBy: session.user.id,
        customerId,
        leadId,
        appointmentId,
        attributionType,
        amount: parsed.data.amount.toFixed(2),
        convertedAt,
        notes,
      })
      .returning()

    // A conversão de um lead marca o estágio do pipeline como convertido
    if (leadId) {
      await db
        .update(leads)
        .set({ stage: 'converted', updatedAt: new Date() })
        .where(and(eq(leads.id, leadId), eq(leads.organizationId, orgId)))
    }

    revalidatePath('/conversions')
    revalidatePath('/dashboard')
    return { success: true, data: newConversion }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao registrar conversão' }
  }
}
