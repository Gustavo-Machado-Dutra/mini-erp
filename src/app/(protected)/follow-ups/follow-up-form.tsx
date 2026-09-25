'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FollowUpType, FollowUpChannel } from '@/db/schema/follow-ups'
import {
  FOLLOW_UP_TYPES,
  FOLLOW_UP_TYPE_LABELS,
  FOLLOW_UP_CHANNELS,
  FOLLOW_UP_CHANNEL_LABELS,
} from '@/modules/follow-ups/types'
import { createFollowUpAction, updateFollowUpAction } from '@/modules/follow-ups/actions'

interface OptionItem {
  id: string
  name: string
}

interface FollowUpFormData {
  id?: string
  targetType: 'customer' | 'lead'
  customerId?: string | null
  leadId?: string | null
  type: FollowUpType
  channel: FollowUpChannel
  scheduledAt: string // YYYY-MM-DDTHH:mm
  notes?: string | null
}

interface FollowUpFormProps {
  mode: 'create' | 'edit'
  initialData?: FollowUpFormData
  customers: OptionItem[]
  leads: OptionItem[]
}

export function FollowUpForm({ mode, initialData, customers, leads }: FollowUpFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [targetType, setTargetType] = useState<'customer' | 'lead'>(
    initialData?.leadId ? 'lead' : 'customer'
  )
  const [customerId, setCustomerId] = useState(initialData?.customerId ?? '')
  const [leadId, setLeadId] = useState(initialData?.leadId ?? '')
  const [type, setType] = useState<FollowUpType>(initialData?.type ?? 'general')
  const [channel, setChannel] = useState<FollowUpChannel>(initialData?.channel ?? 'whatsapp')
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ?? new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  )
  const [notes, setNotes] = useState(initialData?.notes ?? '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (targetType === 'customer' && !customerId) {
      setError('Selecione o cliente para o follow-up')
      return
    }
    if (targetType === 'lead' && !leadId) {
      setError('Selecione o lead para o follow-up')
      return
    }
    if (!scheduledAt) {
      setError('Informe a data e horário agendados')
      return
    }

    startTransition(async () => {
      const dateObj = new Date(scheduledAt)

      if (mode === 'create') {
        const result = await createFollowUpAction({
          customerId: targetType === 'customer' ? customerId : undefined,
          leadId: targetType === 'lead' ? leadId : undefined,
          type,
          channel,
          scheduledAt: dateObj,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/follow-ups/${result.data.id}`)
        router.refresh()
      } else {
        if (!initialData?.id) {
          setError('ID do follow-up não encontrado')
          return
        }

        const result = await updateFollowUpAction({
          id: initialData.id,
          customerId: targetType === 'customer' ? customerId : undefined,
          leadId: targetType === 'lead' ? leadId : undefined,
          type,
          channel,
          scheduledAt: dateObj,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/follow-ups/${initialData.id}`)
        router.refresh()
      }
    })
  }

  const cancelHref =
    mode === 'edit' && initialData?.id ? `/follow-ups/${initialData.id}` : '/follow-ups'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Escolha do Contexto: Lead ou Cliente */}
        <div>
          <Label className="block mb-2">Vincular Follow-up a:</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="targetType"
                checked={targetType === 'customer'}
                onChange={() => setTargetType('customer')}
                disabled={isPending}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Cliente Cadastrado</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="targetType"
                checked={targetType === 'lead'}
                onChange={() => setTargetType('lead')}
                disabled={isPending}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Lead / Oportunidade</span>
            </label>
          </div>
        </div>

        {targetType === 'customer' ? (
          <div>
            <Label htmlFor="fu-customer">
              Cliente <span className="text-red-500">*</span>
            </Label>
            <select
              id="fu-customer"
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
        ) : (
          <div>
            <Label htmlFor="fu-lead">
              Lead / Oportunidade <span className="text-red-500">*</span>
            </Label>
            <select
              id="fu-lead"
              name="leadId"
              required
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">-- Selecione o lead --</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tipo de Follow-up e Canal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fu-type">Tipo de Follow-up</Label>
            <select
              id="fu-type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as FollowUpType)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              {FOLLOW_UP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {FOLLOW_UP_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="fu-channel">Canal Pretendido</Label>
            <select
              id="fu-channel"
              name="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as FollowUpChannel)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              {FOLLOW_UP_CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {FOLLOW_UP_CHANNEL_LABELS[ch]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data/Horário Previsto */}
        <div>
          <Label htmlFor="fu-scheduled">
            Data e Horário Previsto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fu-scheduled"
            name="scheduledAt"
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="mt-1"
            disabled={isPending}
          />
        </div>

        {/* Observações / Contexto do Contato */}
        <div>
          <Label htmlFor="fu-notes">Observações e Contexto do Contato</Label>
          <textarea
            id="fu-notes"
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Cliente pediu para confirmar orçamento do procedimento..."
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
            ? 'Agendar Follow-up'
            : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}