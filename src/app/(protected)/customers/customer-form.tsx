'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCustomerAction, updateCustomerAction } from '@/modules/customers/actions'

interface CustomerFormData {
  id?: string
  name: string
  email?: string | null
  phone?: string | null
  notes?: string | null
}

interface CustomerFormProps {
  mode: 'create' | 'edit'
  initialData?: CustomerFormData
}

export function CustomerForm({ mode, initialData }: CustomerFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
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
        const result = await createCustomerAction({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/customers/${result.data.id}`)
        router.refresh()
      } else {
        if (!initialData?.id) {
          setError('ID do cliente não encontrado para atualização')
          return
        }

        const result = await updateCustomerAction({
          id: initialData.id,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/customers/${initialData.id}`)
        router.refresh()
      }
    })
  }

  const cancelHref = mode === 'edit' && initialData?.id ? `/customers/${initialData.id}` : '/customers'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="customer-name">
            Nome Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customer-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Maria Oliveira"
            className="mt-1"
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer-email">E-mail</Label>
            <Input
              id="customer-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: maria@email.com"
              className="mt-1"
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="customer-phone">Telefone / WhatsApp</Label>
            <Input
              id="customer-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: (11) 98765-4321"
              className="mt-1"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="customer-notes">Observações</Label>
          <textarea
            id="customer-notes"
            name="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informações adicionais, preferências ou observações sobre o cliente..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
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
              ? 'Criando...'
              : 'Salvando...'
            : mode === 'create'
            ? 'Criar Cliente'
            : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}
