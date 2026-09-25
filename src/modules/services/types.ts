import type { Service, NewService } from '@/db/schema/services'

export type { Service, NewService }

export interface ServiceFilterOptions {
  search?: string
  activeOnly?: boolean
  limit?: number
  offset?: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number }