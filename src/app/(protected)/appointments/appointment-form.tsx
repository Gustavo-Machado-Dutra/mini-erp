'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AppointmentStatus } from '@/db/schema/appointments'
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_LABELS } from '@/modules/appointments/types'
import { createAppointmentAction, updateAppointmentAction } from '@/modules/appointments/actions'

interface CustomerOption {
  id: string
  name: string
}

interface ProfessionalOption {
  id: string
  name: string
}

interface ServiceOption {
  id: string
  name: string
  price: string
  durationMinutes: number
}

interface AppointmentFormData {
  id?: string
  customerId: string
  professionalId: string
  serviceId: string
  scheduledAt: string // ISO string para o input datetime-local
  status: AppointmentStatus
  notes?: string | null
}

interface AppointmentFormProps {
  mode: 'create' | 'edit'
  initialData?: AppointmentFormData
  customers: CustomerOption[]
  professionals: ProfessionalOption[]
  services: ServiceOption[]
}

export function AppointmentForm({
  mode,
  initialData,
  customers,
  professionals,
  services,
}: AppointmentFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [customerId, setCustomerId] = useState(initialData?.customerId ?? '')
  const [professionalId, setProfessionalId] = useState(initialData?.professionalId ?? '')
  const [serviceId, setServiceId] = useState(initialData?.serviceId ?? '')
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ?? new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  )
  const [status, setStatus] = useState<AppointmentStatus>(initialData?.status ?? 'scheduled')
  const [notes, setNotes] = useState(initialData?.notes ?? '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!customerId) {
      setError('Selecione um cliente')
      return
    }
    if (!professionalId) {
      setError('Selecione um profissional')
      return
    }
    if (!serviceId) {
      setError('Selecione um serviço')
      return
    }
    if (!scheduledAt) {
      setError('Informe a data e hora do agendamento')
      return
    }

    startTransition(async () => {
      const dateObj = new Date(scheduledAt)

      if (mode === 'create') {
        const result = await createAppointmentAction({
          customerId,
          professionalId,
          serviceId,
          scheduledAt: dateObj,
          status,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/appointments/${result.data.id}`)
        router.refresh()
      } else {
        if (!initialData?.id) {
          setError('ID do agendamento não encontrado')
          return
        }

        const result = await updateAppointmentAction({
          id: initialData.id,
          customerId,
          professionalId,
          serviceId,
          scheduledAt: dateObj,
          status,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/appointments/${initialData.id}`)
        router.refresh()
      }
    })
  }

  const cancelHref =
    mode === 'edit' && initialData?.id ? `/appointments/${initialData.id}` : '/appointments'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Seleção do Cliente */}
        <div>
          <Label htmlFor="appt-customer">
            Cliente <span className="text-red-500">*</span>
          </Label>
          <select
            id="appt-customer"
            name="customerId"
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">-- Selecione o cliente --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Profissional e Serviço */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="appt-prof">
              Profissional <span className="text-red-500">*</span>
            </Label>
            <select
              id="appt-prof"
              name="professionalId"
              required
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">-- Selecione o profissional --</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="appt-service">
              Serviço / Procedimento <span className="text-red-500">*</span>
            </Label>
            <select
              id="appt-service"
              name="serviceId"
              required
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">-- Selecione o serviço --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.durationMinutes} min - R$ {Number(s.price).toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data/Hora e Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="appt-date">
              Data e Horário <span className="text-red-500">*</span>
            </Label>
            <Input
              id="appt-date"
              name="scheduledAt"
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-1"
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="appt-status">Status do Agendamento</Label>
            <select
              id="appt-status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              {APPOINTMENT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {APPOINTMENT_STATUS_LABELS[st]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Observações */}
        <div>
          <Label htmlFor="appt-notes">Observações do Agendamento</Label>
          <textarea
            id="appt-notes"
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Recomendações pré-procedimento, orientações de chegada, etc..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link href={cancelHref}>
          <Button type="button" variant="outline" disabled={isPending}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === 'create'
              ? 'Agendando...'
              : 'Salvando...'
            : mode === 'create'
            ? 'Confirmar Agendamento'
            : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}