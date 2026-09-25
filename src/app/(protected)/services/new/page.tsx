import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { ServiceForm } from '../service-form'
import { ArrowLeft } from 'lucide-react'

export default async function NewServicePage() {
  await requireSession()
  await requireOrganizationForPage()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Serviços</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Serviço</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cadastre um serviço ou procedimento no catálogo da empresa.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <ServiceForm mode="create" />
      </div>
    </div>
  )
}