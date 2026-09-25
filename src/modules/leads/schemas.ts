import { z } from 'zod'
import { LEAD_STAGES } from './types'

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  email: z
    .string()
    .trim()
    .max(255, 'E-mail deve ter no máximo 255 caracteres')
    .email('E-mail inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  phone: z
    .string()
    .trim()
    .max(50, 'Telefone deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  source: z
    .string()
    .trim()
    .max(100, 'Origem deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  stage: z.enum(LEAD_STAGES).default('new'),
  customerId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  notes: z
    .string()
    .trim()
    .max(2000, 'Observações devem ter no máximo 2000 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
})

export type CreateLeadInput = z.input<typeof createLeadSchema>
export type CreateLeadData = z.output<typeof createLeadSchema>

export const updateLeadSchema = createLeadSchema.extend({
  id: z.string().min(1, 'ID do lead é obrigatório'),
})

export type UpdateLeadInput = z.input<typeof updateLeadSchema>
export type UpdateLeadData = z.output<typeof updateLeadSchema>

export const updateLeadStageSchema = z.object({
  id: z.string().min(1, 'ID do lead é obrigatório'),
  stage: z.enum(LEAD_STAGES),
})

export type UpdateLeadStageInput = z.infer<typeof updateLeadStageSchema>