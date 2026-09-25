import { z } from 'zod'

export const createCustomerSchema = z.object({
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
  notes: z
    .string()
    .trim()
    .max(2000, 'Observações devem ter no máximo 2000 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
})

export type CreateCustomerInput = z.input<typeof createCustomerSchema>
export type CreateCustomerData = z.output<typeof createCustomerSchema>

export const updateCustomerSchema = z.object({
  id: z.string().min(1, 'ID do cliente é obrigatório'),
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
  notes: z
    .string()
    .trim()
    .max(2000, 'Observações devem ter no máximo 2000 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
})

export type UpdateCustomerInput = z.input<typeof updateCustomerSchema>
export type UpdateCustomerData = z.output<typeof updateCustomerSchema>
