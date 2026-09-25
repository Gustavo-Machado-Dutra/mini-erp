import { pgTable, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { organizations } from './tenancy'
import { customers } from './customers'
import { leads } from './leads'
import { user } from './auth'

export const followUpTypeEnum = pgEnum('follow_up_type', [
  'price_follow_up',
  'quote_follow_up',
  'reactivation',
  'appointment_follow_up',
  'general',
])

export const followUpStatusEnum = pgEnum('follow_up_status', [
  'pending',
  'completed',
  'cancelled',
])

export const followUpChannelEnum = pgEnum('follow_up_channel', [
  'manual',
  'phone',
  'email',
  'whatsapp',
  'other',
])

export const followUps = pgTable(
  'follow_ups',
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
    leadId: text('lead_id').references(() => leads.id, {
      onDelete: 'set null',
    }),
    type: followUpTypeEnum('type').notNull().default('general'),
    status: followUpStatusEnum('status').notNull().default('pending'),
    channel: followUpChannelEnum('channel').notNull().default('manual'),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    executedAt: timestamp('executed_at', { withTimezone: true }),
    outcome: text('outcome'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('follow_ups_org_idx').on(table.organizationId),
    index('follow_ups_org_status_idx').on(table.organizationId, table.status),
    index('follow_ups_org_scheduled_idx').on(table.organizationId, table.scheduledAt),
    index('follow_ups_customer_idx').on(table.customerId),
    index('follow_ups_lead_idx').on(table.leadId),
  ]
)

export type FollowUp = typeof followUps.$inferSelect
export type NewFollowUp = typeof followUps.$inferInsert
export type FollowUpType = 'price_follow_up' | 'quote_follow_up' | 'reactivation' | 'appointment_follow_up' | 'general'
export type FollowUpStatus = 'pending' | 'completed' | 'cancelled'
export type FollowUpChannel = 'manual' | 'phone' | 'email' | 'whatsapp' | 'other'