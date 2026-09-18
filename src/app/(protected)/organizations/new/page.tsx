'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOrganizationAction } from '@/modules/tenancy/actions'
import { createOrganizationSchema } from '@/modules/tenancy/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewOrganizationPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleNameChange = (val: string) => {
    setName(val)
    // Auto-gera sugestão de slug simplificado
    const generated = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setSlug(generated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError('')

    const validation = createOrganizationSchema.safeParse({ name, slug })
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Dados inválidos')
      setPending(false)
      return
    }

    const result = await createOrganizationAction({ name, slug })

    if (!result.success) {
      setError(result.error)
      setPending(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nova Organização</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cadastre sua empresa para isolar seus clientes, equipe e operações.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Nome da Empresa</Label>
          <Input
            id="org-name"
            placeholder="Ex: Clínica Estética Bella"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-slug">Identificador (Slug)</Label>
          <Input
            id="org-slug"
            placeholder="ex: clinica-bella"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            disabled={pending}
          />
          <p className="text-xs text-gray-400">
            Apenas letras minúsculas, números e hífens.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button className="flex-1" type="submit" disabled={pending}>
            {pending ? 'Criando...' : 'Criar Organização'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={pending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}