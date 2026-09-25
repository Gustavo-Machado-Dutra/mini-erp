import 'server-only'
import { eq, and, gte, lte, lt, desc, asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { followUps } from '@/db/schema/follow-ups'
import { customers } from '@/db/schema/customers'
import { leads } from '@/db/schema/leads'
import { requireOrganization } from '@/modules/tenancy/context'
import type {
  FollowUpWithDetails,
  FollowUpFilterOptions,
  FollowUpCounts,
} from './types'

export async function getFollowUps(
  options: FollowUpFilterOptions = {}
): Promise<FollowUpWithDetails[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200)
  const offset = Math.max(options.offset ?? 0, 0)

  const conditions = [eq(followUps.organizationId, orgId)]

  if (options.type) {
    conditions.push(eq(followUps.type, options.type))
  }

  if (options.channel) {
    conditions.push(eq(followUps.channel, options.channel))
  }

  if (options.customerId) {
    conditions.push(eq(followUps.customerId, options.customerId))
  }

  if (options.leadId) {
    conditions.push(eq(followUps.leadId, options.leadId))
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  if (options.period === 'today') {
    conditions.push(eq(followUps.status, 'pending'))
    conditions.push(gte(followUps.scheduledAt, startOfToday))
    conditions.push(lte(followUps.scheduledAt, endOfToday))
  } else if (options.period === 'overdue') {
    conditions.push(eq(followUps.status, 'pending'))
    conditions.push(lt(followUps.scheduledAt, startOfToday))
  } else if (options.period === 'upcoming') {
    conditions.push(eq(followUps.status, 'pending'))
    conditions.push(gte(followUps.scheduledAt, endOfToday))
  } else if (options.period === 'completed') {
    conditions.push(eq(followUps.status, 'completed'))
  }

  const rows = await db
    .select({
      id: followUps.id,
      organizationId: followUps.organizationId,
      customerId: followUps.customerId,
      leadId: followUps.leadId,
      type: followUps.type,
      status: followUps.status,
      channel: followUps.channel,
      scheduledAt: followUps.scheduledAt,
      executedAt: followUps.executedAt,
      outcome: followUps.outcome,
      notes: followUps.notes,
      createdAt: followUps.createdAt,
      updatedAt: followUps.updatedAt,
      createdBy: followUps.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      customerEmail: customers.email,
      leadName: leads.name,
      leadPhone: leads.phone,
      leadEmail: leads.email,
    })
    .from(followUps)
    .leftJoin(customers, eq(followUps.customerId, customers.id))
    .leftJoin(leads, eq(followUps.leadId, leads.id))
    .where(and(...conditions))
    .orderBy(
      options.period === 'upcoming' || options.period === 'today'
        ? asc(followUps.scheduledAt)
        : desc(followUps.scheduledAt)
    )
    .limit(limit)
    .offset(offset)

  return rows
}

export async function getFollowUpCounts(): Promise<FollowUpCounts> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  const [allRows] = await Promise.all([
    db
      .select({
        status: followUps.status,
        scheduledAt: followUps.scheduledAt,
      })
      .from(followUps)
      .where(eq(followUps.organizationId, orgId)),
  ])

  let today = 0
  let overdue = 0
  let upcoming = 0
  let completed = 0

  for (const row of allRows) {
    if (row.status === 'completed') {
      completed++
    } else if (row.status === 'pending') {
      if (row.scheduledAt >= startOfToday && row.scheduledAt <= endOfToday) {
        today++
      } else if (row.scheduledAt < startOfToday) {
        overdue++
      } else if (row.scheduledAt > endOfToday) {
        upcoming++
      }
    }
  }

  return {
    today,
    overdue,
    upcoming,
    completed,
    all: allRows.length,
  }
}

export async function getFollowUpById(
  id: string
): Promise<FollowUpWithDetails | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [row] = await db
    .select({
      id: followUps.id,
      organizationId: followUps.organizationId,
      customerId: followUps.customerId,
      leadId: followUps.leadId,
      type: followUps.type,
      status: followUps.status,
      channel: followUps.channel,
      scheduledAt: followUps.scheduledAt,
      executedAt: followUps.executedAt,
      outcome: followUps.outcome,
      notes: followUps.notes,
      createdAt: followUps.createdAt,
      updatedAt: followUps.updatedAt,
      createdBy: followUps.createdBy,
      customerName: customers.name,
      customerPhone: customers.phone,
      customerEmail: customers.email,
      leadName: leads.name,
      leadPhone: leads.phone,
      leadEmail: leads.email,
    })
    .from(followUps)
    .leftJoin(customers, eq(followUps.customerId, customers.id))
    .leftJoin(leads, eq(followUps.leadId, leads.id))
    .where(and(eq(followUps.id, id), eq(followUps.organizationId, orgId)))
    .limit(1)

  return row ?? null
}