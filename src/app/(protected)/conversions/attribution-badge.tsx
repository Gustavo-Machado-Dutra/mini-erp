import { CONVERSION_ATTRIBUTION_LABELS, CONVERSION_ATTRIBUTION_COLORS } from '@/modules/conversions/types'
import type { ConversionAttributionType } from '@/db/schema/conversions'

interface AttributionBadgeProps {
  attributionType: ConversionAttributionType
}

export function AttributionBadge({ attributionType }: AttributionBadgeProps) {
  const color = CONVERSION_ATTRIBUTION_COLORS[attributionType]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color.bg} ${color.text} ${color.border}`}
    >
      <span className={`size-1.5 rounded-full ${color.dot}`} />
      {CONVERSION_ATTRIBUTION_LABELS[attributionType]}
    </span>
  )
}
