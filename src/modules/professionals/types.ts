import type { Professional, NewProfessional } from '@/db/schema/professionals'

export type { Professional, NewProfessional }

export interface ProfessionalFilterOptions {
  search?: string
  activeOnly?: boolean
  limit?: number
  offset?: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number }