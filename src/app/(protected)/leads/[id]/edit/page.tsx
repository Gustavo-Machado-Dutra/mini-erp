import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getLeadById } from '@/modules/leads/queries'
import { getCustomers } from '@/modules/customers/queries'
import { LeadForm } from '../../lead-form'
import { ArrowLeft } from 'lucide-react'

interface EditLeadPageProps {
  params: Promise<{ id: string }>
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const lead = await getLeadById(id)

  if (!lead) {
    notFound()
  }

  const customers = await getCustomers({ limit: 100 })
  const customerOptions = customers.map((c) => ({ id: c.id, name: c.name }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={`/leads/${lead.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Detalhes</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Lead</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualize as informações cadastrais e o estágio de {lead.name}.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <LeadForm mode="edit" initialData={lead} customers={customerOptions} />
      </div>
    </div>
  )
}