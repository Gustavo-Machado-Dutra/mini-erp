import { z } from 'zod'
import { REVENUE_SOURCES, REVENUE_STATUSES } from './types'

export const createRevenueSchema = z.object({
  customerId: z.string().trim().min(1, 'Cliente é obrigatório'),
  appointmentId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  conversionId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  amount: z.coerce.number()
    .positive('Valor deve ser maior que zero')
    .max(9999999999.99, 'Valor acima do limite permitido'),
  currency: z
    .string()
    .trim()
    .min(1, 'Moeda é obrigatória')
    .max(10, 'Moeda inválida')
    .default('BRL')
    .transform((val) => val.toUpperCase()),
  source: z.enum(REVENUE_SOURCES).default('manual'),
  status: z.enum(REVENUE_STATUSES).default('recorded'),
  description: z
    .string()
    .trim()
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  occurredAt: z.coerce.date(),
})

export type CreateRevenueInput = z.input<typeof createRevenueSchema>

