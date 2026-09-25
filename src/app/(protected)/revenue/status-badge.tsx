import { REVENUE_STATUS_LABELS, REVENUE_STATUS_COLORS } from '@/modules/revenue/types'
import type { RevenueStatus } from '@/db/schema/revenue'

interface RevenueStatusBadgeProps {
  status: RevenueStatus
}

export function RevenueStatusBadge({ status }: RevenueStatusBadgeProps) {
  const color = REVENUE_STATUS_COLORS[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color.bg} ${color.text} ${color.border}`}
    >
      <span className={`size-1.5 rounded-full ${color.dot}`} />
      {REVENUE_STATUS_LABELS[status]}
    </span>
  )
}
