import { z } from 'zod'
import type { Organization, OrganizationMember, MemberRole } from '@/db/schema/tenancy'

export const memberRoles = ['owner', 'admin', 'member'] as const

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome da organização deve ter no mínimo 2 caracteres')
    .max(100, 'Nome da organização deve ter no máximo 100 caracteres'),
  slug: z
    .string()
    .min(2, 'Slug deve ter no mínimo 2 caracteres')
    .max(50, 'Slug deve ter no máximo 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>

export const switchOrganizationSchema = z.object({
  organizationId: z.string().min(1, 'ID da organização é obrigatório'),
})

export type SwitchOrganizationInput = z.infer<typeof switchOrganizationSchema>

export interface TenantContext {
  organization: Organization
  membership: OrganizationMember
  userId: string
  role: MemberRole
}

export interface UserOrganizationItem {
  id: string
  name: string
  slug: string
  role: MemberRole
  createdAt: Date
}