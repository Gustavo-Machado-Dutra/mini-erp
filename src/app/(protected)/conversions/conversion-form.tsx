'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CONVERSION_ATTRIBUTION_TYPES,
  CONVERSION_ATTRIBUTION_LABELS,
  CONVERSION_ATTRIBUTION_DESCRIPTIONS,
} from '@/modules/conversions/types'
import { createConversionAction } from '@/modules/conversions/actions'
import type { ConversionAttributionType } from '@/db/schema/conversions'

interface OptionItem {
  id: string
  name: string
}

interface ConversionFormProps {
  customers: OptionItem[]
  leads: OptionItem[]
  appointments: OptionItem[]
}

export function ConversionForm({ customers, leads, appointments }: ConversionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [targetType, setTargetType] = useState<'customer' | 'lead'>('customer')
  const [customerId, setCustomerId] = useState('')
  const [leadId, setLeadId] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  const [attributionType, setAttributionType] =
    useState<ConversionAttributionType>('unknown')
  const [amount, setAmount] = useState('')
  const [convertedAt, setConvertedAt] = useState(
    new Date().toISOString().slice(0, 16)
  )
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (targetType === 'customer' && !customerId) {
      setError('Selecione o cliente convertido')
      return
    }
    if (targetType === 'lead' && !leadId) {
      setError('Selecione o lead convertido')
      return
    }
    if (!amount || Number(amount) < 0) {
      setError('Informe um valor válido para a conversão')
      return
    }
    if (!convertedAt) {
      setError('Informe a data da conversão')
      return
    }

    startTransition(async () => {
      const result = await createConversionAction({
        customerId: targetType === 'customer' ? customerId : undefined,
        leadId: targetType === 'lead' ? leadId : undefined,
        appointmentId: appointmentId || undefined,
        attributionType,
        amount: Number(amount),
        convertedAt: new Date(convertedAt),
        notes: notes.trim() || undefined,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push(`/conversions/${result.data.id}`)
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

      <div className="space-y-4">
        <div>
          <Label className="block mb-2">Entidade convertida:</Label>
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
              <span>Cliente</span>
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
            <Label htmlFor="cv-customer">
              Cliente <span className="text-red-500">*</span>
            </Label>
            <select
              id="cv-customer"
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
            <Label htmlFor="cv-lead">
              Lead / Oportunidade <span className="text-red-500">*</span>
            </Label>
            <select
              id="cv-lead"
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

        <div>
          <Label htmlFor="cv-appointment">Agendamento (opcional)</Label>
          <select
            id="cv-appointment"
            name="appointmentId"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">-- Sem agendamento vinculado --</option>
            {appointments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="cv-attribution">Atribuição da conversão</Label>
          <select
            id="cv-attribution"
            name="attributionType"
            value={attributionType}
            onChange={(e) => setAttributionType(e.target.value as ConversionAttributionType)}
            disabled={isPending}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
          >
            {CONVERSION_ATTRIBUTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {CONVERSION_ATTRIBUTION_LABELS[t]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            {CONVERSION_ATTRIBUTION_DESCRIPTIONS[attributionType]}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cv-amount">
              Valor da conversão (R$) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cv-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
              disabled={isPending}
              placeholder="0,00"
            />
          </div>
          <div>
            <Label htmlFor="cv-convertedAt">
              Data da conversão <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cv-convertedAt"
              name="convertedAt"
              type="datetime-local"
              required
              value={convertedAt}
              onChange={(e) => setConvertedAt(e.target.value)}
              className="mt-1"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cv-notes">Observações</Label>
          <textarea
            id="cv-notes"
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Cliente fechou após follow-up de orçamento..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link href="/conversions">
          <Button type="button" variant="outline" disabled={isPending}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Registrando...' : 'Registrar Conversão'}
        </Button>
      </div>
    </form>
  )
}
