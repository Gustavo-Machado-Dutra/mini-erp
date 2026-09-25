import { z } from 'zod'
import { CONVERSION_ATTRIBUTION_TYPES } from './types'

export const createConversionSchema = z
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
    appointmentId: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
    attributionType: z.enum(CONVERSION_ATTRIBUTION_TYPES).default('unknown'),
    amount: z.coerce.number()
      .nonnegative('Valor não pode ser negativo')
      .max(9999999999.99, 'Valor acima do limite permitido'),
    convertedAt: z.coerce.date().default(() => new Date()),
    notes: z
      .string()
      .trim()
      .max(2000, 'Observações devem ter no máximo 2000 caracteres')
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' || !val ? null : val)),
  })
  .refine((data) => data.customerId || data.leadId, {
    message: 'A conversão deve ser vinculada a um Cliente ou a um Lead',
    path: ['customerId'],
  })

export type CreateConversionInput = z.input<typeof createConversionSchema>

