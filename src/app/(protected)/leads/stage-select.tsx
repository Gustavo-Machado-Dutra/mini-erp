'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { LeadStage } from '@/db/schema/leads'
import { LEAD_STAGES, LEAD_STAGE_LABELS } from '@/modules/leads/types'
import { updateLeadStageAction } from '@/modules/leads/actions'

interface StageSelectProps {
  leadId: string
  currentStage: LeadStage
  compact?: boolean
}

export function StageSelect({ leadId, currentStage, compact = false }: StageSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStage = e.target.value as LeadStage
    if (newStage === currentStage) return

    startTransition(async () => {
      await updateLeadStageAction({
        id: leadId,
        stage: newStage,
      })
      router.refresh()
    })
  }

  return (
    <div className="relative inline-block">
      <select
        value={currentStage}
        onChange={handleChange}
        disabled={isPending}
        className={`rounded-md border border-gray-300 bg-white font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 cursor-pointer ${
          compact ? 'text-xs py-1 px-2' : 'text-sm py-1.5 px-3'
        }`}
      >
        {LEAD_STAGES.map((stage) => (
          <option key={stage} value={stage}>
            {LEAD_STAGE_LABELS[stage]}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="ml-2 text-xs text-blue-600 animate-pulse">Atualizando...</span>
      )}
    </div>
  )
}