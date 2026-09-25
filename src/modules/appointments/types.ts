import type { Appointment, NewAppointment, AppointmentStatus } from '@/db/schema/appointments'

export type { Appointment, NewAppointment, AppointmentStatus }

export const APPOINTMENT_STATUSES = [
  'scheduled',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
] as const

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não Compareceu',
}

export const APPOINTMENT_STATUS_COLORS: Record<
  AppointmentStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-500' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  no_show: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
}

export interface AppointmentWithDetails extends Appointment {
  customerName: string
  customerPhone?: string | null
  customerEmail?: string | null
  professionalName: string
  serviceName: string
  servicePrice: string
  serviceDuration: number
}

export interface AppointmentFilterOptions {
  period?: 'today' | 'upcoming' | 'past' | 'all'
  status?: AppointmentStatus
  professionalId?: string
  customerId?: string
  limit?: number
  offset?: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number }