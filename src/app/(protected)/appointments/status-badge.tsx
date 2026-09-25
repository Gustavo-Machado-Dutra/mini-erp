import type { AppointmentStatus } from '@/db/schema/appointments'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/modules/appointments/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: AppointmentStatus
  className?: string
}

export function AppointmentStatusBadge({ status, className }: StatusBadgeProps) {
  const config = APPOINTMENT_STATUS_COLORS[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  }
  const label = APPOINTMENT_STATUS_LABELS[status] || status

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dot)} />
      <span>{label}</span>
    </span>
  )
}