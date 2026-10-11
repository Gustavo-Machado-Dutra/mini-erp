'use client'

import Link from 'next/link'
import type { PipelineStageGroup } from '@/modules/leads/types'
import { LEAD_STAGE_COLORS } from '@/modules/leads/types'
import { StageSelect } from './stage-select'
import { Phone, Mail, Tag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PipelineViewProps {
  stageGroups: PipelineStageGroup[]
}

export function PipelineView({ stageGroups }: PipelineViewProps) {
  const totalLeads = stageGroups.reduce((acc, g) => acc + g.count, 0)

  if (totalLeads === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
          <Tag className="size-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Nenhum lead no pipeline
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          Cadastre seus primeiros leads para acompanhar as oportunidades no funil comercial.
        </p>
        <Link href="/leads/new">
          <Button className="flex items-center gap-2 mx-auto">
            <Plus className="size-4" />
            <span>Cadastrar Lead</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div role="region" aria-label="Funil por est?gio" tabIndex={0} className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1100px]">
        {stageGroups.map((group) => {
          const colorConfig = LEAD_STAGE_COLORS[group.stage] || {
            bg: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-200',
            dot: 'bg-gray-400',
          }

          return (
            <div
              key={group.stage}
              className="flex-1 bg-gray-50/70 border border-gray-200 rounded-lg flex flex-col min-w-[220px]"
            >
              {/* Header da Coluna */}
              <div className="p-3 border-b border-gray-200/80 bg-white rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${colorConfig.dot}`} />
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {group.label}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {group.count}
                </span>
              </div>

              {/* Cards de Leads */}
              <div className="p-2 space-y-2.5 flex-1 min-h-[300px]">
                {group.leads.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-md text-xs text-gray-400">
                    Sem leads
                  </div>
                ) : (
                  group.leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-3.5 rounded-md border border-gray-200 shadow-sm hover:border-blue-300 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-medium text-sm text-gray-900 hover:text-blue-600 break-words"
                        >
                          {lead.name}
                        </Link>
                      </div>

                      {lead.source && (
                        <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                          {lead.source}
                        </span>
                      )}

                      <div className="space-y-1 text-xs text-gray-500">
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="size-3 text-gray-400 shrink-0" />
                            <span className="truncate">{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="size-3 text-gray-400 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                        <StageSelect leadId={lead.id} currentStage={lead.stage} compact />
                        <Link
                          href={`/leads/${lead.id}`}
                          className="text-[11px] text-gray-500 hover:text-blue-600 underline font-medium"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}