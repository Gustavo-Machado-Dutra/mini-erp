import 'server-only'
import { eq, and, ilike, or, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { professionals } from '@/db/schema/professionals'
import { requireOrganization } from '@/modules/tenancy/context'
import type { Professional, ProfessionalFilterOptions } from './types'

export async function getProfessionals(
  options: ProfessionalFilterOptions = {}
): Promise<Professional[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200)
  const offset = Math.max(options.offset ?? 0, 0)
  const search = options.search?.trim()

  const conditions = [eq(professionals.organizationId, orgId)]

  if (options.activeOnly) {
    conditions.push(eq(professionals.active, true))
  }

  if (search) {
    const pattern = `%${search}%`
    conditions.push(
      or(
        ilike(professionals.name, pattern),
        ilike(professionals.email, pattern),
        ilike(professionals.phone, pattern)
      )!
    )
  }

  return db
    .select()
    .from(professionals)
    .where(and(...conditions))
    .orderBy(desc(professionals.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function getProfessionalById(id: string): Promise<Professional | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [prof] = await db
    .select()
    .from(professionals)
    .where(and(eq(professionals.id, id), eq(professionals.organizationId, orgId)))
    .limit(1)

  return prof ?? null
}