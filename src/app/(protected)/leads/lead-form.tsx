'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LeadStage } from '@/db/schema/leads'
import { LEAD_STAGES, LEAD_STAGE_LABELS } from '@/modules/leads/types'
import { createLeadAction, updateLeadAction } from '@/modules/leads/actions'

interface CustomerOption {
  id: string
  name: string
}

interface LeadFormData {
  id?: string
  name: string
  email?: string | null
  phone?: string | null
  source?: string | null
  stage?: LeadStage
  customerId?: string | null
  notes?: string | null
}

interface LeadFormProps {
  mode: 'create' | 'edit'
  initialData?: LeadFormData
  customers: CustomerOption[]
}

const COMMON_SOURCES = [
  'Instagram',
  'WhatsApp',
  'Google Ads',
  'Indicação',
  'Site / Landing Page',
  'Facebook',
  'Outro',
]

export function LeadForm({ mode, initialData, customers }: LeadFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [source, setSource] = useState(initialData?.source ?? '')
  const [stage, setStage] = useState<LeadStage>(initialData?.stage ?? 'new')
  const [customerId, setCustomerId] = useState(initialData?.customerId ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    startTransition(async () => {
      if (mode === 'create') {
        const result = await createLeadAction({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          source: source.trim() || undefined,
          stage,
          customerId: customerId.trim() || undefined,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/leads/${result.data.id}`)
        router.refresh()
      } else {
        if (!initialData?.id) {
          setError('ID do lead não encontrado')
          return
        }

        const result = await updateLeadAction({
          id: initialData.id,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          source: source.trim() || undefined,
          stage,
          customerId: customerId.trim() || undefined,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/leads/${initialData.id}`)
        router.refresh()
      }
    })
  }

  const cancelHref =
    mode === 'edit' && initialData?.id ? `/leads/${initialData.id}` : '/leads'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Nome do Lead */}
        <div>
          <Label htmlFor="lead-name">
            Nome do Lead / Oportunidade <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lead-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Roberto Almeida - Harmonização Facial"
            className="mt-1"
            disabled={isPending}
          />
        </div>

        {/* Contato (Email + Telefone) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lead-email">E-mail</Label>
            <Input
              id="lead-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: roberto@email.com"
              className="mt-1"
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="lead-phone">Telefone / WhatsApp</Label>
            <Input
              id="lead-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: (11) 99887-7665"
              className="mt-1"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Estágio do Pipeline e Origem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lead-stage">Estágio no Pipeline</Label>
            <select
              id="lead-stage"
              name="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value as LeadStage)}
              disabled={isPending}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              {LEAD_STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {LEAD_STAGE_LABELS[stg]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="lead-source">Origem do Lead</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="lead-source"
                name="source"
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Ex: Instagram, Indicação, etc."
                disabled={isPending}
                className="flex-1"
              />
              <select
                onChange={(e) => {
                  if (e.target.value) setSource(e.target.value)
                }}
                disabled={isPending}
                defaultValue=""
                className="rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-xs text-gray-700 shadow-sm"
              >
                <option value="" disabled>
                  Sugestões
                </option>
                {COMMON_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cliente Vinculado (Opcional) */}
        <div>
          <Label htmlFor="lead-customer">Cliente Vinculado (Opcional)</Label>
          <select
            id="lead-customer"
            name="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            disabled={isPending}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">-- Nenhum cliente vinculado --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Se o lead já for um cliente cadastrado, você pode associá-lo aqui.
          </p>
        </div>

        {/* Observações */}
        <div>
          <Label htmlFor="lead-notes">Observações e Histórico Inicial</Label>
          <textarea
            id="lead-notes"
            name="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informações sobre o interesse do lead, procedimentos desejados ou histórico de contato..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link href={cancelHref}>
          <Button type="button" variant="outline" disabled={isPending}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === 'create'
              ? 'Criando...'
              : 'Salvando...'
            : mode === 'create'
            ? 'Cadastrar Lead'
            : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}