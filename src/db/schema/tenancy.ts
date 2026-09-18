import { pgTable, text, timestamp, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { user } from './auth'

export const memberRoleEnum = pgEnum('member_role', ['owner', 'admin', 'member'])

export const organizations = pgTable('organizations', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const profiles = pgTable('profiles', {
  id: text('id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  fullName: text('full_name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const organizationMembers = pgTable(
  'organization_members',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: memberRoleEnum('role').notNull().default('member'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('org_user_unique_idx').on(table.organizationId, table.userId),
  ]
)

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert

export type OrganizationMember = typeof organizationMembers.$inferSelect
export type NewOrganizationMember = typeof organizationMembers.$inferInsert
export type MemberRole = 'owner' | 'admin' | 'member'