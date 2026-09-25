import type { Customer, NewCustomer } from '@/db/schema/customers'

export type { Customer, NewCustomer }

export interface CustomerFilterOptions {
  search?: string
  limit?: number
  offset?: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number; fieldErrors?: Record<string, string[]> }
