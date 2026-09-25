import { z } from 'zod'
import { APPOINTMENT_STATUSES } from './types'

export const createAppointmentSchema = z.object({
  customerId: z.string().min(1, 'Cliente é obrigatório'),
  professionalId: z.string().min(1, 'Profissional é obrigatório'),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  scheduledAt: z.coerce.date(),
  status: z.enum(APPOINTMENT_STATUSES).default('scheduled'),
  notes: z
    .string()
    .trim()
    .max(2000, 'Observações devem ter no máximo 2000 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' || !val ? null : val)),
})

export type CreateAppointmentInput = z.input<typeof createAppointmentSchema>

export const updateAppointmentSchema = createAppointmentSchema.extend({
  id: z.string().min(1, 'ID do agendamento é obrigatório'),
})

export type UpdateAppointmentInput = z.input<typeof updateAppointmentSchema>

export const updateAppointmentStatusSchema = z.object({
  id: z.string().min(1, 'ID do agendamento é obrigatório'),
  status: z.enum(APPOINTMENT_STATUSES),
})

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>