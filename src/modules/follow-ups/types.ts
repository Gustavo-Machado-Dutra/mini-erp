import type {
  FollowUp,
  NewFollowUp,
  FollowUpType,
  FollowUpStatus,
  FollowUpChannel,
} from '@/db/schema/follow-ups'

export type { FollowUp, NewFollowUp, FollowUpType, FollowUpStatus, FollowUpChannel }

export const FOLLOW_UP_TYPES = [
  'price_follow_up',
  'quote_follow_up',
  'reactivation',
  'appointment_follow_up',
  'general',
] as const

export const FOLLOW_UP_TYPE_LABELS: Record<FollowUpType, string> = {
  price_follow_up: 'Follow-up de Preço',
  quote_follow_up: 'Acompanhamento de Orçamento',
  reactivation: 'Reativação de Cliente',
  appointment_follow_up: 'Confirmação / Pós-Agendamento',
  general: 'Geral / Outros',
}

export const FOLLOW_UP_STATUSES = ['pending', 'completed', 'cancelled'] as const

export const FOLLOW_UP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  pending: 'Pendente',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

export const FOLLOW_UP_STATUS_COLORS: Record<
  FollowUpStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', dot: 'bg-gray-400' },
}

export const FOLLOW_UP_CHANNELS = ['manual', 'phone', 'email', 'whatsapp', 'other'] as const

export const FOLLOW_UP_CHANNEL_LABELS: Record<FollowUpChannel, string> = {
  manual: 'Manual / Presencial',
  phone: 'Ligação Telefônica',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  other: 'Outro Canal',
}

export interface FollowUpWithDetails extends FollowUp {
  customerName?: string | null
  customerPhone?: string | null
  customerEmail?: string | null
  leadName?: string | null
  leadPhone?: string | null
  leadEmail?: string | null
}

export interface FollowUpCounts {
  today: number
  overdue: number
  upcoming: number
  completed: number
  all: number
}

export interface FollowUpFilterOptions {
  period?: 'today' | 'overdue' | 'upcoming' | 'completed' | 'all'
  type?: FollowUpType
  channel?: FollowUpChannel
  customerId?: string
  leadId?: string
  limit?: number
  offset?: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number }