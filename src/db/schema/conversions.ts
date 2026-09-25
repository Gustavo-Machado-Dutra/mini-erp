import { pgTable, text, timestamp, numeric, index, pgEnum } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { organizations } from './tenancy'
import { leads } from './leads'
import { customers } from './customers'
import { appointments } from './appointments'
import { user } from './auth'

export const conversionAttributionTypeEnum = pgEnum('conversion_attribution_type', [
  'direct_conversion',
  'follow_up_conversion',
  'reactivation_conversion',
  'manual_conversion',
  'unknown',
])

export const conversions = pgTable(
  'conversions',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    leadId: text('lead_id').references(() => leads.id, { onDelete: 'set null' }),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    appointmentId: text('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
    attributionType: conversionAttributionTypeEnum('attribution_type').notNull().default('unknown'),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    convertedAt: timestamp('converted_at').notNull().defaultNow(),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [
    index('conversions_org_idx').on(table.organizationId),
    index('conversions_org_created_idx').on(table.organizationId, table.createdAt),
    index('conversions_lead_idx').on(table.leadId),
    index('conversions_customer_idx').on(table.customerId),
  ]
)

export type Conversion = typeof conversions.$inferSelect
export type NewConversion = typeof conversions.$inferInsert
export type ConversionAttributionType =
  | 'direct_conversion'
  | 'follow_up_conversion'
  | 'reactivation_conversion'
  | 'manual_conversion'
  | 'unknown'
