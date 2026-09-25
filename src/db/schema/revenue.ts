import { pgTable, text, timestamp, numeric, index, pgEnum } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { organizations } from './tenancy'
import { customers } from './customers'
import { appointments } from './appointments'
import { conversions } from './conversions'
import { user } from './auth'

export const revenueStatusEnum = pgEnum('revenue_status', ['recorded', 'received'])

export const revenueSourceEnum = pgEnum('revenue_source', ['manual', 'appointment', 'conversion', 'other'])

export const revenue = pgTable(
  'revenue',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    appointmentId: text('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
    conversionId: text('conversion_id').references(() => conversions.id, { onDelete: 'set null' }),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('BRL'),
    source: revenueSourceEnum('source').notNull().default('manual'),
    status: revenueStatusEnum('status').notNull().default('recorded'),
    description: text('description'),
    occurredAt: timestamp('occurred_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [
    index('revenue_org_idx').on(table.organizationId),
    index('revenue_org_occurred_idx').on(table.organizationId, table.occurredAt),
    index('revenue_customer_idx').on(table.customerId),
    index('revenue_conversion_idx').on(table.conversionId),
  ]
)

export type Revenue = typeof revenue.$inferSelect
export type NewRevenue = typeof revenue.$inferInsert
export type RevenueStatus = 'recorded' | 'received'
export type RevenueSource = 'manual' | 'appointment' | 'conversion' | 'other'
