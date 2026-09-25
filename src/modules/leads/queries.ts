import 'server-only'
import { eq, and, or, ilike, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { leads } from '@/db/schema/leads'
import { customers } from '@/db/schema/customers'
import { requireOrganization } from '@/modules/tenancy/context'
import {
  LEAD_STAGES,
  LEAD_STAGE_LABELS,
  type LeadWithCustomer,
  type LeadFilterOptions,
  type PipelineStageGroup,
} from './types'

/**
 * Lista leads da organização com busca, filtro por estágio e paginação.
 */
export async function getLeads(
  options: LeadFilterOptions = {}
): Promise<LeadWithCustomer[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200)
  const offset = Math.max(options.offset ?? 0, 0)
  const search = options.search?.trim()

  const conditions = [eq(leads.organizationId, orgId)]

  if (options.stage) {
    conditions.push(eq(leads.stage, options.stage))
  }

  if (options.customerId) {
    conditions.push(eq(leads.customerId, options.customerId))
  }

  if (search) {
    const pattern = `%${search}%`
    conditions.push(
      or(
        ilike(leads.name, pattern),
        ilike(leads.email, pattern),
        ilike(leads.phone, pattern),
        ilike(leads.source, pattern)
      )!
    )
  }

  const rows = await db
    .select({
      id: leads.id,
      organizationId: leads.organizationId,
      customerId: leads.customerId,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      source: leads.source,
      stage: leads.stage,
      notes: leads.notes,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
      createdBy: leads.createdBy,
      customerName: customers.name,
    })
    .from(leads)
    .leftJoin(customers, eq(leads.customerId, customers.id))
    .where(and(...conditions))
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .offset(offset)

  return rows
}

/**
 * Obtém os leads agrupados pelos estágios do pipeline para a visão Kanban.
 */
export async function getLeadsGroupedByStage(
  search?: string
): Promise<PipelineStageGroup[]> {
  const allLeads = await getLeads({ search, limit: 200 })

  return LEAD_STAGES.map((stage) => {
    const stageLeads = allLeads.filter((l) => l.stage === stage)
    return {
      stage,
      label: LEAD_STAGE_LABELS[stage],
      leads: stageLeads,
      count: stageLeads.length,
    }
  })
}

/**
 * Obtém um lead específico pelo ID com isolamento rigoroso por organização.
 */
export async function getLeadById(id: string): Promise<LeadWithCustomer | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [row] = await db
    .select({
      id: leads.id,
      organizationId: leads.organizationId,
      customerId: leads.customerId,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      source: leads.source,
      stage: leads.stage,
      notes: leads.notes,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
      createdBy: leads.createdBy,
      customerName: customers.name,
    })
    .from(leads)
    .leftJoin(customers, eq(leads.customerId, customers.id))
    .where(and(eq(leads.id, id), eq(leads.organizationId, orgId)))
    .limit(1)

  return row ?? null
}