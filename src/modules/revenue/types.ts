import type {
  Revenue,
  NewRevenue,
  RevenueStatus,
  RevenueSource,
} from '@/db/schema/revenue'
import type { ConversionAttributionType } from '@/db/schema/conversions'

export type { Revenue, NewRevenue, RevenueStatus, RevenueSource }

export const REVENUE_STATUSES = ['recorded', 'received'] as const

export const REVENUE_STATUS_LABELS: Record<RevenueStatus, string> = {
  recorded: 'Registrada',
  received: 'Recebida',
}

export const REVENUE_STATUS_COLORS: Record<
  RevenueStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  recorded: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  received: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
}

export const REVENUE_SOURCES = ['manual', 'appointment', 'conversion', 'other'] as const

export const REVENUE_SOURCE_LABELS: Record<RevenueSource, string> = {
  manual: 'Manual / Outros',
  appointment: 'Agendamento',
  conversion: 'Conversão',
  other: 'Outro',
}

export interface RevenueWithDetails extends Revenue {
  customerName?: string | null
  customerPhone?: string | null
  conversionAttributionType?: ConversionAttributionType | null
  appointmentNotes?: string | null
}

export interface RevenueFilterOptions {
  source?: RevenueSource
  status?: RevenueStatus
  customerId?: string
  conversionId?: string
  limit?: number
  offset?: number
}

export interface RevenueTotals {
  registered: number
  recovered: number
  unassigned: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number }
