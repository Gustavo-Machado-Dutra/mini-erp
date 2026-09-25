import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { ProfessionalForm } from '../professional-form'
import { ArrowLeft } from 'lucide-react'

export default async function NewProfessionalPage() {
  await requireSession()
  await requireOrganizationForPage()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/professionals"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Profissionais</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Profissional</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cadastre um profissional ou atendente na organização.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <ProfessionalForm mode="create" />
      </div>
    </div>
  )
}