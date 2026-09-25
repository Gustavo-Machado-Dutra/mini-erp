import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { organizations } from './tenancy'
import { user } from './auth'

export const customers = pgTable(
  'customers',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [
    index('customers_org_idx').on(table.organizationId),
    index('customers_org_created_idx').on(table.organizationId, table.createdAt),
  ]
)

export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
