import 'server-only'
import { eq, and, desc, sql, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { revenue } from '@/db/schema/revenue'
import { customers } from '@/db/schema/customers'
import { conversions } from '@/db/schema/conversions'
import { appointments } from '@/db/schema/appointments'
import { requireOrganization } from '@/modules/tenancy/context'
import { RECOVERED_ATTRIBUTION_TYPES } from '@/modules/conversions/types'
import type { RevenueWithDetails, RevenueFilterOptions, RevenueTotals } from './types'

export async function getRevenue(
  options: RevenueFilterOptions = {}
): Promise<RevenueWithDetails[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200)
  const offset = Math.max(options.offset ?? 0, 0)

  const conditions = [eq(revenue.organizationId, orgId)]

  if (options.source) {
    conditions.push(eq(revenue.source, options.source))
  }
  if (options.status) {
    conditions.push(eq(revenue.status, options.status))
  }
  if (options.customerId) {
    conditions.push(eq(revenue.customerId, options.customerId))
  }
  if (options.conversionId) {
    conditions.push(eq(revenue.conversionId, options.conversionId))
  }

  return db
    .select({
      id: revenue.id,
      organizationId: revenue.organizationId,
      customerId: revenue.customerId,
      appointmentId: revenue.appointmentId,
      conversionId: revenue.conversionId,
      amount: revenue.amount,
      currency: revenue.currency,
      source: revenue.source,
      status: revenue.status,
      description: revenue.description,
      occurredAt: revenue.occurredAt,
      createdAt: revenue.createdAt,
      updatedAt: revenue.updatedAt,
      createdBy: revenue.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      conversionAttributionType: conversions.attributionType,
      appointmentNotes: appointments.notes,
    })
    .from(revenue)
    .leftJoin(customers, eq(revenue.customerId, customers.id))
    .leftJoin(conversions, eq(revenue.conversionId, conversions.id))
    .leftJoin(appointments, eq(revenue.appointmentId, appointments.id))
    .where(and(...conditions))
    .orderBy(desc(revenue.occurredAt))
    .limit(limit)
    .offset(offset)
}

export async function getRevenueById(id: string): Promise<RevenueWithDetails | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [row] = await db
    .select({
      id: revenue.id,
      organizationId: revenue.organizationId,
      customerId: revenue.customerId,
      appointmentId: revenue.appointmentId,
      conversionId: revenue.conversionId,
      amount: revenue.amount,
      currency: revenue.currency,
      source: revenue.source,
      status: revenue.status,
      description: revenue.description,
      occurredAt: revenue.occurredAt,
      createdAt: revenue.createdAt,
      updatedAt: revenue.updatedAt,
      createdBy: revenue.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      conversionAttributionType: conversions.attributionType,
      appointmentNotes: appointments.notes,
    })
    .from(revenue)
    .leftJoin(customers, eq(revenue.customerId, customers.id))
    .leftJoin(conversions, eq(revenue.conversionId, conversions.id))
    .leftJoin(appointments, eq(revenue.appointmentId, appointments.id))
    .where(and(eq(revenue.id, id), eq(revenue.organizationId, orgId)))
    .limit(1)

  return row ?? null
}

/**
 * Totais financeiros da organização ativa:
 * - registered: toda receita registrada;
 * - recovered: receita vinculada a conversões com evidência de ação do RevenueFlow;
 * - unassigned: receita registrada sem atribuição.
 */
export async function getRevenueTotals(): Promise<RevenueTotals> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [registeredRow] = await db
    .select({
      total: sql<string>`coalesce(sum(${revenue.amount}), 0)`.mapWith(Number),
    })
    .from(revenue)
    .where(eq(revenue.organizationId, orgId))

  const [recoveredRow] = await db
    .select({
      total: sql<string>`coalesce(sum(${revenue.amount}), 0)`.mapWith(Number),
    })
    .from(revenue)
    .innerJoin(conversions, eq(revenue.conversionId, conversions.id))
    .where(
      and(
        eq(revenue.organizationId, orgId),
        eq(conversions.organizationId, orgId),
        inArray(conversions.attributionType, RECOVERED_ATTRIBUTION_TYPES)
      )
    )

  const registered = registeredRow?.total ?? 0
  const recovered = recoveredRow?.total ?? 0

  return {
    registered,
    recovered,
    unassigned: Math.max(registered - recovered, 0),
  }
}
