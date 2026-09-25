import 'server-only'
import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { conversions } from '@/db/schema/conversions'
import { customers } from '@/db/schema/customers'
import { leads } from '@/db/schema/leads'
import { appointments } from '@/db/schema/appointments'
import { requireOrganization } from '@/modules/tenancy/context'
import type { ConversionWithDetails, ConversionFilterOptions } from './types'

export async function getConversions(
  options: ConversionFilterOptions = {}
): Promise<ConversionWithDetails[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200)
  const offset = Math.max(options.offset ?? 0, 0)

  const conditions = [eq(conversions.organizationId, orgId)]

  if (options.customerId) {
    conditions.push(eq(conversions.customerId, options.customerId))
  }
  if (options.leadId) {
    conditions.push(eq(conversions.leadId, options.leadId))
  }
  if (options.attributionType) {
    conditions.push(eq(conversions.attributionType, options.attributionType))
  }

  return db
    .select({
      id: conversions.id,
      organizationId: conversions.organizationId,
      leadId: conversions.leadId,
      customerId: conversions.customerId,
      appointmentId: conversions.appointmentId,
      attributionType: conversions.attributionType,
      amount: conversions.amount,
      convertedAt: conversions.convertedAt,
      notes: conversions.notes,
      createdAt: conversions.createdAt,
      createdBy: conversions.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      leadName: leads.name,
      appointmentTitle: appointments.notes,
    })
    .from(conversions)
    .leftJoin(customers, eq(conversions.customerId, customers.id))
    .leftJoin(leads, eq(conversions.leadId, leads.id))
    .leftJoin(appointments, eq(conversions.appointmentId, appointments.id))
    .where(and(...conditions))
    .orderBy(desc(conversions.convertedAt))
    .limit(limit)
    .offset(offset)
}

export async function getConversionById(id: string): Promise<ConversionWithDetails | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [row] = await db
    .select({
      id: conversions.id,
      organizationId: conversions.organizationId,
      leadId: conversions.leadId,
      customerId: conversions.customerId,
      appointmentId: conversions.appointmentId,
      attributionType: conversions.attributionType,
      amount: conversions.amount,
      convertedAt: conversions.convertedAt,
      notes: conversions.notes,
      createdAt: conversions.createdAt,
      createdBy: conversions.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      leadName: leads.name,
      appointmentTitle: appointments.notes,
    })
    .from(conversions)
    .leftJoin(customers, eq(conversions.customerId, customers.id))
    .leftJoin(leads, eq(conversions.leadId, leads.id))
    .leftJoin(appointments, eq(conversions.appointmentId, appointments.id))
    .where(and(eq(conversions.id, id), eq(conversions.organizationId, orgId)))
    .limit(1)

  return row ?? null
}
