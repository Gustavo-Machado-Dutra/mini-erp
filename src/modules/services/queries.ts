import 'server-only'
import { eq, and, ilike, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { services } from '@/db/schema/services'
import { requireOrganization } from '@/modules/tenancy/context'
import type { Service, ServiceFilterOptions } from './types'

export async function getServices(
  options: ServiceFilterOptions = {}
): Promise<Service[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200)
  const offset = Math.max(options.offset ?? 0, 0)
  const search = options.search?.trim()

  const conditions = [eq(services.organizationId, orgId)]

  if (options.activeOnly) {
    conditions.push(eq(services.active, true))
  }

  if (search) {
    conditions.push(ilike(services.name, `%${search}%`))
  }

  return db
    .select()
    .from(services)
    .where(and(...conditions))
    .orderBy(desc(services.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function getServiceById(id: string): Promise<Service | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, id), eq(services.organizationId, orgId)))
    .limit(1)

  return service ?? null
}