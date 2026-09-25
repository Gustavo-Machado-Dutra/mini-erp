import type {
  Conversion,
  NewConversion,
  ConversionAttributionType,
} from '@/db/schema/conversions'

export type { Conversion, NewConversion, ConversionAttributionType }

export const CONVERSION_ATTRIBUTION_TYPES = [
  'direct_conversion',
  'follow_up_conversion',
  'reactivation_conversion',
  'manual_conversion',
  'unknown',
] as const

export const CONVERSION_ATTRIBUTION_LABELS: Record<ConversionAttributionType, string> = {
  direct_conversion: 'Conversão Direta',
  follow_up_conversion: 'Recuperada por Follow-up',
  reactivation_conversion: 'Reativação de Cliente',
  manual_conversion: 'Registro Manual',
  unknown: 'Não atribuída',
}

export const CONVERSION_ATTRIBUTION_DESCRIPTIONS: Record<ConversionAttributionType, string> = {
  direct_conversion: 'Cliente converteu sem ação registrada do RevenueFlow.',
  follow_up_conversion: 'Evidência de follow-up participando da conversão.',
  reactivation_conversion: 'Evidência de reativação de cliente participando da conversão.',
  manual_conversion: 'Conversão registrada manualmente, sem evidência de atribuição.',
  unknown: 'Sem informação suficiente para atribuir a receita.',
}

export const CONVERSION_ATTRIBUTION_COLORS: Record<
  ConversionAttributionType,
  { bg: string; text: string; border: string; dot: string }
> = {
  direct_conversion: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  follow_up_conversion: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  reactivation_conversion: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  manual_conversion: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  unknown: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', dot: 'bg-gray-400' },
}

/**
 * Regra de atribuição do MVP (SPEC seções 10.2 e 10.3):
 * apenas conversões com evidência de ação do RevenueFlow contam como receita recuperada.
 */
export const RECOVERED_ATTRIBUTION_TYPES: ConversionAttributionType[] = [
  'follow_up_conversion',
  'reactivation_conversion',
]

export function isRecoveredAttributionType(
  attributionType: ConversionAttributionType
): boolean {
  return RECOVERED_ATTRIBUTION_TYPES.includes(attributionType)
}

export interface ConversionWithDetails extends Conversion {
  customerName?: string | null
  customerPhone?: string | null
  leadName?: string | null
  appointmentTitle?: string | null
}

export interface ConversionFilterOptions {
  customerId?: string
  leadId?: string
  attributionType?: ConversionAttributionType
  limit?: number
  offset?: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number }
