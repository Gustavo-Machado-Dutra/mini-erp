import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getCustomers } from '@/modules/customers/queries'
import { LeadForm } from '../lead-form'
import { ArrowLeft } from 'lucide-react'

export default async function NewLeadPage() {
  await requireSession()
  await requireOrganizationForPage()

  const customers = await getCustomers({ limit: 100 })
  const customerOptions = customers.map((c) => ({ id: c.id, name: c.name }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Leads</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Lead</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cadastre uma nova oportunidade ou contato comercial no pipeline.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <LeadForm mode="create" customers={customerOptions} />
      </div>
    </div>
  )
}