import 'server-only'
import { eq, and, gte, desc, sql, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { revenue } from '@/db/schema/revenue'
import { conversions } from '@/db/schema/conversions'
import { followUps } from '@/db/schema/follow-ups'
import { customers } from '@/db/schema/customers'
import { leads } from '@/db/schema/leads'
import { requireOrganization } from '@/modules/tenancy/context'
import { RECOVERED_ATTRIBUTION_TYPES } from '@/modules/conversions/types'
import type { LeadStage } from '@/db/schema/leads'

export interface PipelineCount {
  stage: LeadStage
  count: number
}

export interface RecentActivity {
  id: string
  type: 'conversion' | 'revenue' | 'follow_up'
  title: string
  occurredAt: Date
}

export interface MonthlyRevenue {
  month: string
  registered: number
  recovered: number
}

export interface DashboardMetrics {
  leads30d: number
  conversions30d: number
  conversionRate: number
  pendingFollowUps: number
  todayFollowUps: number
  overdueFollowUps: number
  upcomingFollowUps: number
  registeredRevenue30d: number
  recoveredRevenue30d: number
  totalCustomers: number
  pipeline: PipelineCount[]
  recentActivities: RecentActivity[]
  monthlySeries: MonthlyRevenue[]
}

const STAGES: LeadStage[] = ['new', 'contacted', 'interested', 'scheduled', 'converted', 'lost']

const RECOVERED_SQL = (table: typeof conversions) =>
  inArray(table.attributionType, RECOVERED_ATTRIBUTION_TYPES)

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [
    leads30d,
    conversions30d,
    registered30d,
    recovered30d,
    followUpRows,
    customerCount,
    pipelineRows,
    recentConversions,
    recentRevenue,
    recentFollowUps,
    monthlyRegistered,
    monthlyRecovered,
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(and(eq(leads.organizationId, orgId), gte(leads.createdAt, thirtyDaysAgo))),
    db
      .select({ count: sql<number>`count(*)` })
      .from(conversions)
      .where(and(eq(conversions.organizationId, orgId), gte(conversions.convertedAt, thirtyDaysAgo))),
    db
      .select({ total: sql<string>`coalesce(sum(${revenue.amount}), 0)`.mapWith(Number) })
      .from(revenue)
      .where(and(eq(revenue.organizationId, orgId), gte(revenue.occurredAt, thirtyDaysAgo))),
    db
      .select({ total: sql<string>`coalesce(sum(${revenue.amount}), 0)`.mapWith(Number) })
      .from(revenue)
      .innerJoin(conversions, eq(revenue.conversionId, conversions.id))
      .where(
        and(
          eq(revenue.organizationId, orgId),
          eq(conversions.organizationId, orgId),
          gte(revenue.occurredAt, thirtyDaysAgo),
          RECOVERED_SQL(conversions)
        )
      ),
    db
      .select({ status: followUps.status, scheduledAt: followUps.scheduledAt })
      .from(followUps)
      .where(eq(followUps.organizationId, orgId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.organizationId, orgId)),
    db
      .select({ stage: leads.stage, count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.organizationId, orgId))
      .groupBy(leads.stage),
    db
      .select({ id: conversions.id, convertedAt: conversions.convertedAt })
      .from(conversions)
      .where(eq(conversions.organizationId, orgId))
      .orderBy(desc(conversions.convertedAt))
      .limit(8),
    db
      .select({ id: revenue.id, occurredAt: revenue.occurredAt })
      .from(revenue)
      .where(eq(revenue.organizationId, orgId))
      .orderBy(desc(revenue.occurredAt))
      .limit(8),
    db
      .select({ id: followUps.id, scheduledAt: followUps.scheduledAt })
      .from(followUps)
      .where(eq(followUps.organizationId, orgId))
      .orderBy(desc(followUps.scheduledAt))
      .limit(8),
    db
      .select({
        month: sql<string>`to_char(${revenue.occurredAt}, 'YYYY-MM')`,
        total: sql<string>`coalesce(sum(${revenue.amount}), 0)`.mapWith(Number),
      })
      .from(revenue)
      .where(and(eq(revenue.organizationId, orgId), gte(revenue.occurredAt, sixMonthsAgo)))
      .groupBy(sql`to_char(${revenue.occurredAt}, 'YYYY-MM')`),
    db
      .select({
        month: sql<string>`to_char(${revenue.occurredAt}, 'YYYY-MM')`,
        total: sql<string>`coalesce(sum(${revenue.amount}), 0)`.mapWith(Number),
      })
      .from(revenue)
      .innerJoin(conversions, eq(revenue.conversionId, conversions.id))
      .where(
        and(
          eq(revenue.organizationId, orgId),
          eq(conversions.organizationId, orgId),
          gte(revenue.occurredAt, sixMonthsAgo),
          RECOVERED_SQL(conversions)
        )
      )
      .groupBy(sql`to_char(${revenue.occurredAt}, 'YYYY-MM')`),
  ])

  const leadsCount = Number(leads30d[0]?.count ?? 0)
  const conversionsCount = Number(conversions30d[0]?.count ?? 0)

  let today = 0
  let overdue = 0
  let upcoming = 0
  let pending = 0
  for (const row of followUpRows) {
    if (row.status === 'pending') {
      pending++
      if (row.scheduledAt >= startOfToday && row.scheduledAt <= endOfToday) {
        today++
      } else if (row.scheduledAt < startOfToday) {
        overdue++
      } else {
        upcoming++
      }
    }
  }

  const pipeline: PipelineCount[] = STAGES.map((stage) => ({
    stage,
    count: pipelineRows.find((r) => r.stage === stage)?.count ?? 0,
  }))

  const recentActivities: RecentActivity[] = [
    ...recentFollowUps.map((r) => ({ id: `fu_${r.id}`, type: 'follow_up' as const, title: 'Follow-up registrado', occurredAt: r.scheduledAt })),
    ...recentConversions.map((r) => ({ id: `cv_${r.id}`, type: 'conversion' as const, title: 'Conversão registrada', occurredAt: r.convertedAt })),
    ...recentRevenue.map((r) => ({ id: `rv_${r.id}`, type: 'revenue' as const, title: 'Receita registrada', occurredAt: r.occurredAt })),
  ]
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, 8)

  const monthlyMap = new Map<string, MonthlyRevenue>()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyMap.set(key, { month: key, registered: 0, recovered: 0 })
  }
  for (const row of monthlyRegistered) {
    const entry = monthlyMap.get(row.month)
    if (entry) entry.registered = row.total
  }
  for (const row of monthlyRecovered) {
    const entry = monthlyMap.get(row.month)
    if (entry) entry.recovered = row.total
  }

  return {
    leads30d: leadsCount,
    conversions30d: conversionsCount,
    conversionRate: leadsCount > 0 ? Math.round((conversionsCount / leadsCount) * 1000) / 10 : 0,
    pendingFollowUps: pending,
    todayFollowUps: today,
    overdueFollowUps: overdue,
    upcomingFollowUps: upcoming,
    registeredRevenue30d: registered30d[0]?.total ?? 0,
    recoveredRevenue30d: recovered30d[0]?.total ?? 0,
    totalCustomers: Number(customerCount[0]?.count ?? 0),
    pipeline,
    recentActivities,
    monthlySeries: [...monthlyMap.values()],
  }
}
