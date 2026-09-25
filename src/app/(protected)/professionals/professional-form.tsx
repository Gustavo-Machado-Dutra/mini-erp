'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProfessionalAction, updateProfessionalAction } from '@/modules/professionals/actions'

interface ProfessionalFormData {
  id?: string
  name: string
  email?: string | null
  phone?: string | null
  active?: boolean
}

interface ProfessionalFormProps {
  mode: 'create' | 'edit'
  initialData?: ProfessionalFormData
}

export function ProfessionalForm({ mode, initialData }: ProfessionalFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [active, setActive] = useState(initialData?.active ?? true)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Nome do profissional é obrigatório')
      return
    }

    startTransition(async () => {
      if (mode === 'create') {
        const result = await createProfessionalAction({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          active,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/professionals/${result.data.id}`)
        router.refresh()
      } else {
        if (!initialData?.id) {
          setError('ID do profissional não encontrado')
          return
        }

        const result = await updateProfessionalAction({
          id: initialData.id,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          active,
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        router.push(`/professionals/${initialData.id}`)
        router.refresh()
      }
    })
  }

  const cancelHref =
    mode === 'edit' && initialData?.id ? `/professionals/${initialData.id}` : '/professionals'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="prof-name">
            Nome do Profissional <span className="text-red-500">*</span>
          </Label>
          <Input
            id="prof-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Dra. Camila Torres / Dr. Felipe Reis"
            className="mt-1"
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prof-email">E-mail de Contato</Label>
            <Input
              id="prof-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: camila@empresa.com"
              className="mt-1"
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="prof-phone">Telefone / WhatsApp</Label>
            <Input
              id="prof-phone"
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

        <div className="flex items-center gap-2 pt-2">
          <input
            id="prof-active"
            name="active"
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            disabled={isPending}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 size-4"
          />
          <Label htmlFor="prof-active" className="cursor-pointer">
            Profissional ativo na escala e disponível para agendamentos
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
            ? 'Cadastrar Profissional'
            : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}