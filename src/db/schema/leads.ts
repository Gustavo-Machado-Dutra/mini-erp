import { pgTable, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { organizations } from './tenancy'
import { customers } from './customers'
import { user } from './auth'

export const leadStageEnum = pgEnum('lead_stage', [
  'new',
  'contacted',
  'interested',
  'scheduled',
  'converted',
  'lost',
])

export const leads = pgTable(
  'leads',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').references(() => customers.id, {
      onDelete: 'set null',
    }),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    source: text('source'),
    stage: leadStageEnum('stage').notNull().default('new'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('leads_org_idx').on(table.organizationId),
    index('leads_org_stage_idx').on(table.organizationId, table.stage),
    index('leads_org_created_idx').on(table.organizationId, table.createdAt),
    index('leads_customer_idx').on(table.customerId),
  ]
)

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type LeadStage = 'new' | 'contacted' | 'interested' | 'scheduled' | 'converted' | 'lost'