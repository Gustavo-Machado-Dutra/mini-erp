import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { CustomerForm } from '../customer-form'
import { ArrowLeft } from 'lucide-react'

export default async function NewCustomerPage() {
  await requireSession()
  await requireOrganizationForPage()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Clientes</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cadastre um novo cliente na base da organização.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <CustomerForm mode="create" />
      </div>
    </div>
  )
}
