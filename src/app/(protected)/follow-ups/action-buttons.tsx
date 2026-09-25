'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { completeFollowUpAction, cancelFollowUpAction } from '@/modules/follow-ups/actions'
import { CheckCircle2, XCircle } from 'lucide-react'

interface FollowUpActionButtonsProps {
  followUpId: string
  status: string
  compact?: boolean
}

export function FollowUpActionButtons({
  followUpId,
  status,
  compact = false,
}: FollowUpActionButtonsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [outcome, setOutcome] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (status !== 'pending') {
    return null
  }

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!outcome.trim()) {
      setError('Informe o resultado do contato')
      return
    }

    startTransition(async () => {
      const res = await completeFollowUpAction({
        id: followUpId,
        outcome: outcome.trim(),
      })
      if (!res.success) {
        setError(res.error)
        return
      }
      setShowCompleteModal(false)
      router.refresh()
    })
  }

  const handleCancel = () => {
    if (confirm('Deseja realmente cancelar este follow-up?')) {
      startTransition(async () => {
        await cancelFollowUpAction({
          id: followUpId,
          reason: 'Cancelado pelo usuário',
        })
        router.refresh()
      })
    }
  }

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <Button
          size={compact ? 'sm' : 'default'}
          variant="outline"
          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
          onClick={() => setShowCompleteModal(true)}
          disabled={isPending}
        >
          <CheckCircle2 className="size-3.5 mr-1" />
          <span>Concluir</span>
        </Button>
        <Button
          size={compact ? 'sm' : 'default'}
          variant="outline"
          className="text-rose-700 hover:text-rose-800 hover:bg-rose-50 border-rose-200"
          onClick={handleCancel}
          disabled={isPending}
        >
          <XCircle className="size-3.5 mr-1" />
          <span>Cancelar</span>
        </Button>
      </div>

      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Concluir Follow-up</h3>
            <p className="text-sm text-gray-500">
              Registre o desfecho do contato realizado (ex: &quot;Cliente agendou para quinta-feira&quot;, &quot;Pediu para retornar em 15 dias&quot;).
            </p>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="outcome-input">
                  Resultado / Desfecho <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="outcome-input"
                  required
                  rows={3}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Descreva o que foi conversado ou acordado..."
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isPending}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCompleteModal(false)}
                  disabled={isPending}
                >
                  Fechar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Salvando...' : 'Salvar Desfecho'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}