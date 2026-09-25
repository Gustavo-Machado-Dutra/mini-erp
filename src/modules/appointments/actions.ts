'use server'

import { revalidatePath } from 'next/cache'
import { eq, and, ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import { appointments } from '@/db/schema/appointments'
import { customers } from '@/db/schema/customers'
import { professionals } from '@/db/schema/professionals'
import { services } from '@/db/schema/services'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  type CreateAppointmentInput,
  type UpdateAppointmentInput,
  type UpdateAppointmentStatusInput,
} from './schemas'
import type { ActionResult, Appointment } from './types'

/**
 * Cria um novo agendamento com validação estrita de pertencimento de tenant
 * de Customer, Professional e Service, além de checagem básica de conflito de horário.
 */
export async function createAppointmentAction(
  rawInput: CreateAppointmentInput
): Promise<ActionResult<Appointment>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = createAppointmentSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { customerId, professionalId, serviceId, scheduledAt, status, notes } = parsed.data

    // 1. Validar que Customer pertence à organização ativa
    const [cust] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.organizationId, orgId)))
      .limit(1)

    if (!cust) {
      return { success: false, error: 'O cliente selecionado não pertence à sua organização', statusCode: 400 }
    }

    // 2. Validar que Professional pertence à organização ativa
    const [prof] = await db
      .select({ id: professionals.id })
      .from(professionals)
      .where(and(eq(professionals.id, professionalId), eq(professionals.organizationId, orgId)))
      .limit(1)

    if (!prof) {
      return { success: false, error: 'O profissional selecionado não pertence à sua organização', statusCode: 400 }
    }

    // 3. Validar que Service pertence à organização ativa
    const [serv] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.organizationId, orgId)))
      .limit(1)

    if (!serv) {
      return { success: false, error: 'O serviço selecionado não pertence à sua organização', statusCode: 400 }
    }

    // 4. Checagem de conflito de horário para o mesmo profissional
    const [conflict] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.organizationId, orgId),
          eq(appointments.professionalId, professionalId),
          eq(appointments.scheduledAt, scheduledAt),
          ne(appointments.status, 'cancelled')
        )
      )
      .limit(1)

    if (conflict) {
      return {
        success: false,
        error: 'Este profissional já possui um agendamento neste mesmo horário',
        statusCode: 409,
      }
    }

    const [newAppointment] = await db
      .insert(appointments)
      .values({
        organizationId: orgId,
        createdBy: session.user.id,
        customerId,
        professionalId,
        serviceId,
        scheduledAt,
        status: status ?? 'scheduled',
        notes,
      })
      .returning()

    revalidatePath('/appointments')
    return { success: true, data: newAppointment }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao criar agendamento' }
  }
}

/**
 * Atualiza um agendamento existente com validação de tenant e conflito.
 */
export async function updateAppointmentAction(
  rawInput: UpdateAppointmentInput
): Promise<ActionResult<Appointment>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = updateAppointmentSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos', statusCode: 400 }
    }

    const { id, customerId, professionalId, serviceId, scheduledAt, status, notes } = parsed.data

    const [existing] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(and(eq(appointments.id, id), eq(appointments.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Agendamento não encontrado', statusCode: 404 }
    }

    // Validar relacionamentos
    const [cust] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.organizationId, orgId)))
      .limit(1)
    if (!cust) return { success: false, error: 'Cliente inválido', statusCode: 400 }

    const [prof] = await db
      .select({ id: professionals.id })
      .from(professionals)
      .where(and(eq(professionals.id, professionalId), eq(professionals.organizationId, orgId)))
      .limit(1)
    if (!prof) return { success: false, error: 'Profissional inválido', statusCode: 400 }

    const [serv] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.organizationId, orgId)))
      .limit(1)
    if (!serv) return { success: false, error: 'Serviço inválido', statusCode: 400 }

    // Conflito de horário excluindo o próprio agendamento
    const [conflict] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.organizationId, orgId),
          eq(appointments.professionalId, professionalId),
          eq(appointments.scheduledAt, scheduledAt),
          ne(appointments.id, id),
          ne(appointments.status, 'cancelled')
        )
      )
      .limit(1)

    if (conflict) {
      return {
        success: false,
        error: 'Este profissional já possui outro agendamento neste horário',
        statusCode: 409,
      }
    }

    const [updated] = await db
      .update(appointments)
      .set({
        customerId,
        professionalId,
        serviceId,
        scheduledAt,
        status,
        notes,
        updatedAt: new Date(),
      })
      .where(and(eq(appointments.id, id), eq(appointments.organizationId, orgId)))
      .returning()

    revalidatePath('/appointments')
    revalidatePath(`/appointments/${id}`)
    revalidatePath(`/appointments/${id}/edit`)
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar agendamento' }
  }
}

/**
 * Atualiza o status do agendamento (ex: confirmado, concluído, cancelado).
 */
export async function updateAppointmentStatusAction(
  rawInput: UpdateAppointmentStatusInput
): Promise<ActionResult<Appointment>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()
    const orgId = activeContext.organization.id

    const parsed = updateAppointmentStatusSchema.safeParse(rawInput)
    if (!parsed.success) {
      return { success: false, error: 'Status inválido', statusCode: 400 }
    }

    const { id, status } = parsed.data

    const [existing] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(and(eq(appointments.id, id), eq(appointments.organizationId, orgId)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Agendamento não encontrado', statusCode: 404 }
    }

    const [updated] = await db
      .update(appointments)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(appointments.id, id), eq(appointments.organizationId, orgId)))
      .returning()

    revalidatePath('/appointments')
    revalidatePath(`/appointments/${id}`)
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro ao atualizar status do agendamento' }
  }
}