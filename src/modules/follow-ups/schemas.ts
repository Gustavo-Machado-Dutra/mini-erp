import { z } from 'zod'
import { FOLLOW_UP_TYPES, FOLLOW_UP_CHANNELS } from './types'

export const createFollowUpSchema = z
  .object({
    customerId: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
    leadId: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
    type: z.enum(FOLLOW_UP_TYPES).default('general'),
    channel: z.enum(FOLLOW_UP_CHANNELS).default('whatsapp'),
    scheduledAt: z.coerce.date(),
    notes: z
      .string()
      .trim()
      .max(2000, 'Observações devem ter no máximo 2000 caracteres')
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
  })
  .refine((data) => data.customerId || data.leadId, {
    message: 'O follow-up deve ser vinculado a um Cliente ou a um Lead',
    path: ['customerId'],
  })

export type CreateFollowUpInput = z.input<typeof createFollowUpSchema>

export const updateFollowUpSchema = z
  .object({
    id: z.string().min(1, 'ID do follow-up é obrigatório'),
    customerId: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
    leadId: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
    type: z.enum(FOLLOW_UP_TYPES),
    channel: z.enum(FOLLOW_UP_CHANNELS),
    scheduledAt: z.coerce.date(),
    notes: z
      .string()
      .trim()
      .max(2000, 'Observações devem ter no máximo 2000 caracteres')
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
  })
  .refine((data) => data.customerId || data.leadId, {
    message: 'O follow-up deve ser vinculado a um Cliente ou a um Lead',
    path: ['customerId'],
  })

export type UpdateFollowUpInput = z.input<typeof updateFollowUpSchema>

export const completeFollowUpSchema = z.object({
  id: z.string().min(1, 'ID do follow-up é obrigatório'),
  outcome: z
    .string()
    .trim()
    .min(2, 'Informe o resultado/desfecho do contato')
    .max(1000, 'Desfecho deve ter no máximo 1000 caracteres'),
})

export type CompleteFollowUpInput = z.infer<typeof completeFollowUpSchema>

export const cancelFollowUpSchema = z.object({
  id: z.string().min(1, 'ID do follow-up é obrigatório'),
  reason: z
    .string()
    .trim()
    .max(500, 'Motivo deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
})

export type CancelFollowUpInput = z.infer<typeof cancelFollowUpSchema>