'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { AppointmentStatus } from '@/db/schema/appointments'
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_LABELS } from '@/modules/appointments/types'
import { updateAppointmentStatusAction } from '@/modules/appointments/actions'

interface StatusSelectProps {
  appointmentId: string
  currentStatus: AppointmentStatus
}

export function AppointmentStatusSelect({ appointmentId, currentStatus }: StatusSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as AppointmentStatus
    if (newStatus === currentStatus) return

    startTransition(async () => {
      await updateAppointmentStatusAction({
        id: appointmentId,
        status: newStatus,
      })
      router.refresh()
    })
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="text-xs font-medium py-1 px-2.5 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
      >
        {APPOINTMENT_STATUSES.map((st) => (
          <option key={st} value={st}>
            {APPOINTMENT_STATUS_LABELS[st]}
          </option>
        ))}
      </select>
      {isPending && <span className="text-xs text-blue-600 animate-pulse">Atualizando...</span>}
    </div>
  )
}