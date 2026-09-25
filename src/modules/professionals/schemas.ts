import { z } from 'zod'

export const createProfessionalSchema = z.object({
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
  active: z.boolean().default(true),
})

export type CreateProfessionalInput = z.input<typeof createProfessionalSchema>

export const updateProfessionalSchema = createProfessionalSchema.extend({
  id: z.string().min(1, 'ID do profissional é obrigatório'),
})

export type UpdateProfessionalInput = z.input<typeof updateProfessionalSchema>