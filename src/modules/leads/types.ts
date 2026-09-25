import type { Lead, NewLead, LeadStage } from '@/db/schema/leads'

export type { Lead, NewLead, LeadStage }

export const LEAD_STAGES = [
  'new',
  'contacted',
  'interested',
  'scheduled',
  'converted',
  'lost',
] as const

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: 'Novo',
  contacted: 'Contato Feito',
  interested: 'Interessado',
  scheduled: 'Agendado',
  converted: 'Convertido',
  lost: 'Perdido',
}

export const LEAD_STAGE_COLORS: Record<LeadStage, { bg: string; text: string; border: string; dot: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  contacted: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  interested: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  scheduled: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  converted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  lost: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
}

export interface LeadFilterOptions {
  search?: string
  stage?: LeadStage
  customerId?: string
  limit?: number
  offset?: number
}

export interface LeadWithCustomer extends Lead {
  customerName?: string | null
}

export interface PipelineStageGroup {
  stage: LeadStage
  label: string
  leads: LeadWithCustomer[]
  count: number
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number; fieldErrors?: Record<string, string[]> }