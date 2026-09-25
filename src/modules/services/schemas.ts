import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nome do serviço deve ter no mínimo 2 caracteres')
    .max(200, 'Nome do serviço deve ter no máximo 200 caracteres'),
  description: z
    .string()
    .trim()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
  durationMinutes: z.coerce
    .number()
    .int('Duração deve ser em minutos inteiros')
    .min(1, 'Duração mínima é de 1 minuto')
    .max(1440, 'Duração máxima é de 1440 minutos (24 horas)'),
  price: z.coerce
    .number()
    .min(0, 'Preço não pode ser negativo')
    .transform((val) => val.toFixed(2)),
  active: z.boolean().default(true),
})

export type CreateServiceInput = z.input<typeof createServiceSchema>

export const updateServiceSchema = createServiceSchema.extend({
  id: z.string().min(1, 'ID do serviço é obrigatório'),
})

export type UpdateServiceInput = z.input<typeof updateServiceSchema>