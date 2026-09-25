import type { LeadStage } from '@/db/schema/leads'
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/modules/leads/types'
import { cn } from '@/lib/utils'

interface StageBadgeProps {
  stage: LeadStage
  className?: string
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const config = LEAD_STAGE_COLORS[stage] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  }
  const label = LEAD_STAGE_LABELS[stage] || stage

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