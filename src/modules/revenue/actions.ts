'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { revenue } from '@/db/schema/revenue'
import { conversions } from '@/db/schema/conversions'
import { customers } from '@/db/schema/customers'
import { appointments } from '@/db/schema/appointments'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import { createRevenueSchema, type CreateRevenueInput } from './schemas'
import type { ActionResult, Revenue } from './types'

export async function createRevenueAction(
  rawInput: CreateRevenueInput
): Promise<ActionResult<Revenue>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = createRevenueSchema.safeParse(rawInput)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Dados inválidos',
        statusCode: 400,
      }
    }

    const { customerId, appointmentId, conversionId, currency, source, status, occurredAt, description } =
      parsed.data

    // Validação multi-tenant: todas as entidades vinculadas devem pertencer à organização ativa
    const [cust] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.organizationId, orgId)))
      .limit(1)
    if (!cust) {
      return { success: false, error: 'O cliente vinculado não pertence à sua organização', statusCode: 400 }
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

    if (conversionId) {
      const [conv] = await db
        .select({ id: conversions.id })
        .from(conversions)
        .where(and(eq(conversions.id, conversionId), eq(conversions.organizationId, orgId)))
        .limit(1)
      if (!conv) {
        return { success: false, error: 'A conversão vinculada não pertence à sua organização', statusCode: 400 }
      }
    }

    const [newRevenue] = await db
      .insert(revenue)
      .values({
        organizationId: orgId,
        createdBy: session.user.id,
        customerId,
        appointmentId,
        conversionId,
        amount: parsed.data.amount.toFixed(2),
        currency,
        source,
        status,
        description,
        occurredAt,
      })
      .returning()

    revalidatePath('/revenue')
    revalidatePath('/dashboard')
    return { success: true, data: newRevenue }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao registrar receita' }
  }
}
