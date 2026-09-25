import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { organizations } from './tenancy'
import { user } from './auth'

export const professionals = pgTable(
  'professionals',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('professionals_org_idx').on(table.organizationId),
    index('professionals_org_active_idx').on(table.organizationId, table.active),
  ]
)

export type Professional = typeof professionals.$inferSelect
export type NewProfessional = typeof professionals.$inferInsert