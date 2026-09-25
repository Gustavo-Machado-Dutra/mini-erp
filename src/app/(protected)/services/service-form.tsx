'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createServiceAction, updateServiceAction } from '@/modules/services/actions'

interface ServiceFormData {
  id?: string
  name: string
  description?: string | null
  durationMinutes: number
  price: string
  active?: boolean
}

interface ServiceFormProps {
  mode: 'create' | 'edit'
  initialData?: ServiceFormData
}

export function ServiceForm({ mode, initialData }: ServiceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes ?? 60)
  const [price, setPrice] = useState(initialData?.price ?? '0.00')
  const [active, setActive] = useState(initialData?.active ?? true)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Nome do serviço é obrigatório')
      return
    }

    startTransition(async () => {
      if (mode === 'create') {
        const result = await createServiceAction({
          name: name.trim(),
          description: description.trim() || undefined,
          durationMinutes: Number(durationMinutes),
          price: Number(price),
          active,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/services/${result.data.id}`)
        router.refresh()
      } else {
        if (!initialData?.id) {
          setError('ID do serviço não encontrado')
          return
        }

        const result = await updateServiceAction({
          id: initialData.id,
          name: name.trim(),
          description: description.trim() || undefined,
          durationMinutes: Number(durationMinutes),
          price: Number(price),
          active,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/services/${initialData.id}`)
        router.refresh()
      }
    })
  }

  const cancelHref =
    mode === 'edit' && initialData?.id ? `/services/${initialData.id}` : '/services'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="service-name">
            Nome do Serviço <span className="text-red-500">*</span>
          </Label>
          <Input
            id="service-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Consulta Inicial / Limpeza de Pele"
            className="mt-1"
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="service-duration">
              Duração (em minutos) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="service-duration"
              name="durationMinutes"
              type="number"
              min="1"
              max="1440"
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              placeholder="60"
              className="mt-1"
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="service-price">
              Preço (R$) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="service-price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="150.00"
              className="mt-1"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="service-description">Descrição do Serviço</Label>
          <textarea
            id="service-description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes sobre o procedimento, indicações ou materiais inclusos..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            disabled={isPending}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="service-active"
            name="active"
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            disabled={isPending}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 size-4"
          />
          <Label htmlFor="service-active" className="cursor-pointer">
            Serviço ativo para novos agendamentos
          </Label>
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
              ? 'Criando...'
              : 'Salvando...'
            : mode === 'create'
            ? 'Cadastrar Serviço'
            : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}