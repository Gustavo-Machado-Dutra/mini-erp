import 'server-only'
import { eq, and, or, ilike, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customers } from '@/db/schema/customers'
import { requireOrganization } from '@/modules/tenancy/context'
import type { Customer, CustomerFilterOptions } from './types'

/**
 * Lista clientes da organização ativa com suporte a busca e paginação básica.
 */
export async function getCustomers(
  options: CustomerFilterOptions = {}
): Promise<Customer[]> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const limit = Math.min(Math.max(options.limit ?? 50, 1), 100)
  const offset = Math.max(options.offset ?? 0, 0)
  const search = options.search?.trim()

  if (search) {
    const pattern = `%${search}%`
    return db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.organizationId, orgId),
          or(
            ilike(customers.name, pattern),
            ilike(customers.email, pattern),
            ilike(customers.phone, pattern)
          )
        )
      )
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset)
  }

  return db
    .select()
    .from(customers)
    .where(eq(customers.organizationId, orgId))
    .orderBy(desc(customers.createdAt))
    .limit(limit)
    .offset(offset)
}

/**
 * Obtém um cliente específico pelo ID, garantindo estrito isolamento de tenant.
 * Retorna null caso o cliente não exista ou pertença a outra organização.
 */
export async function getCustomerById(id: string): Promise<Customer | null> {
  const activeContext = await requireOrganization()
  const orgId = activeContext.organization.id

  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.organizationId, orgId)))
    .limit(1)

  return customer ?? null
}
