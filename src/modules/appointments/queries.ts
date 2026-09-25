import 'server-only'
import { eq, and, gte, lte, lt, desc, asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { appointments } from '@/db/schema/appointments'
import { customers } from '@/db/schema/customers'
import { professionals } from '@/db/schema/professionals'
import { services } from '@/db/schema/services'
import { requireOrganization } from '@/modules/tenancy/context'
import type { AppointmentWithDetails, AppointmentFilterOptions } from './types'

export async function getAppointments(
  options: AppointmentFilterOptions = {}
): Promise<AppointmentWithDetails[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200)
  const offset = Math.max(options.offset ?? 0, 0)

  const conditions = [eq(appointments.organizationId, orgId)]

  if (options.status) {
    conditions.push(eq(appointments.status, options.status))
  }

  if (options.professionalId) {
    conditions.push(eq(appointments.professionalId, options.professionalId))
  }

  if (options.customerId) {
    conditions.push(eq(appointments.customerId, options.customerId))
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  if (options.period === 'today') {
    conditions.push(gte(appointments.scheduledAt, startOfToday))
    conditions.push(lte(appointments.scheduledAt, endOfToday))
  } else if (options.period === 'upcoming') {
    conditions.push(gte(appointments.scheduledAt, now))
  } else if (options.period === 'past') {
    conditions.push(lt(appointments.scheduledAt, now))
  }

  const rows = await db
    .select({
      id: appointments.id,
      organizationId: appointments.organizationId,
      customerId: appointments.customerId,
      professionalId: appointments.professionalId,
      serviceId: appointments.serviceId,
      scheduledAt: appointments.scheduledAt,
      status: appointments.status,
      notes: appointments.notes,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      createdBy: appointments.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      customerEmail: customers.email,
      professionalName: professionals.name,
      serviceName: services.name,
      servicePrice: services.price,
      serviceDuration: services.durationMinutes,
    })
    .from(appointments)
    .innerJoin(customers, eq(appointments.customerId, customers.id))
    .innerJoin(professionals, eq(appointments.professionalId, professionals.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(and(...conditions))
    .orderBy(options.period === 'upcoming' ? asc(appointments.scheduledAt) : desc(appointments.scheduledAt))
    .limit(limit)
    .offset(offset)

  return rows
}

export async function getAppointmentById(
  id: string
): Promise<AppointmentWithDetails | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [row] = await db
    .select({
      id: appointments.id,
      organizationId: appointments.organizationId,
      customerId: appointments.customerId,
      professionalId: appointments.professionalId,
      serviceId: appointments.serviceId,
      scheduledAt: appointments.scheduledAt,
      status: appointments.status,
      notes: appointments.notes,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      createdBy: appointments.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      customerEmail: customers.email,
      professionalName: professionals.name,
      serviceName: services.name,
      servicePrice: services.price,
      serviceDuration: services.durationMinutes,
    })
    .from(appointments)
    .innerJoin(customers, eq(appointments.customerId, customers.id))
    .innerJoin(professionals, eq(appointments.professionalId, professionals.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(and(eq(appointments.id, id), eq(appointments.organizationId, orgId)))
    .limit(1)

  return row ?? null
}