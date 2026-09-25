import { pgTable, text, timestamp, boolean, integer, numeric, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { organizations } from './tenancy'
import { user } from './auth'

export const services = pgTable(
  'services',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    durationMinutes: integer('duration_minutes').notNull().default(60),
    price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0.00'),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('services_org_idx').on(table.organizationId),
    index('services_org_active_idx').on(table.organizationId, table.active),
  ]
)

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert