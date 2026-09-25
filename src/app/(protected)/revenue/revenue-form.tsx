'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  REVENUE_SOURCES,
  REVENUE_SOURCE_LABELS,
  REVENUE_STATUSES,
  REVENUE_STATUS_LABELS,
} from '@/modules/revenue/types'
import { createRevenueAction } from '@/modules/revenue/actions'
import type { RevenueSource, RevenueStatus } from '@/db/schema/revenue'

interface OptionItem {
  id: string
  name: string
}

interface RevenueFormProps {
  customers: OptionItem[]
  appointments: OptionItem[]
  conversions: OptionItem[]
  initialConversionId?: string | null
  initialCustomerId?: string | null
  initialAmount?: number | null
  conversionNotice?: string | null
}

/**
 * Formulário de receita. Quando vem de uma conversão (initialConversionId),
 * o vínculo fica fixo e o cliente/valor são pré-carregados do lado do servidor.
 */
export function RevenueForm({
  customers,
  appointments,
  conversions,
  initialConversionId = null,
  initialCustomerId = null,
  initialAmount = null,
  conversionNotice = null,
}: RevenueFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [customerId, setCustomerId] = useState(initialCustomerId ?? '')
  const [appointmentId, setAppointmentId] = useState('')
  const [conversionId, setConversionId] = useState(initialConversionId ?? '')
  const [amount, setAmount] = useState(initialAmount != null ? String(initialAmount) : '')
  const [source, setSource] = useState<RevenueSource>('manual')
  const [status, setStatus] = useState<RevenueStatus>('recorded')
  const [description, setDescription] = useState('')
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16))

  const conversionLocked = Boolean(initialConversionId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!customerId) {
      setError('Selecione o cliente para a receita')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setError('Informe um valor válido para a receita')
      return
    }
    if (!occurredAt) {
      setError('Informe a data da receita')
      return
    }

    startTransition(async () => {
      const result = await createRevenueAction({
        customerId,
        appointmentId: appointmentId || undefined,
        conversionId: conversionId || undefined,
        amount: Number(amount),
        source,
        status,
        description: description.trim() || undefined,
        occurredAt: new Date(occurredAt),
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push(`/revenue/${result.data.id}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {conversionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-sm">
          {conversionNotice}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="rv-customer">
            Cliente <span className="text-red-500">*</span>
          </Label>
          <select
            id="rv-customer"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rv-appointment">Agendamento (opcional)</Label>
            <select
              id="rv-appointment"
              name="appointmentId"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">-- Sem agendamento --</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="rv-conversion">Conversão vinculada</Label>
            <select
              id="rv-conversion"
              name="conversionId"
              value={conversionId}
              onChange={(e) => setConversionId(e.target.value)}
              disabled={isPending || conversionLocked}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">-- Sem conversão --</option>
              {conversions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {conversionLocked && (
              <p className="mt-1 text-xs text-muted-foreground">
                Conversão fixa vinda do fluxo de conversão. Só conversões da sua organização estão disponíveis.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="rv-amount">
              Valor (R$) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rv-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
              disabled={isPending}
              placeholder="0,00"
            />
          </div>
          <div>
            <Label htmlFor="rv-source">Origem</Label>
            <select
              id="rv-source"
              name="source"
              value={source}
              onChange={(e) => setSource(e.target.value as RevenueSource)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              {REVENUE_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {REVENUE_SOURCE_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="rv-status">Status</Label>
            <select
              id="rv-status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as RevenueStatus)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              {REVENUE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {REVENUE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="rv-occurredAt">
            Data da receita <span className="text-red-500">*</span>
          </Label>
          <Input
            id="rv-occurredAt"
            name="occurredAt"
            type="datetime-local"
            required
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            className="mt-1"
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="rv-description">Descrição</Label>
          <textarea
            id="rv-description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Pagamento do procedimento Peeling de Diamante..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link href={initialConversionId ? `/conversions/${initialConversionId}` : '/revenue'}>
          <Button type="button" variant="outline" disabled={isPending}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Registrando...' : 'Registrar Receita'}
        </Button>
      </div>
    </form>
  )
}
