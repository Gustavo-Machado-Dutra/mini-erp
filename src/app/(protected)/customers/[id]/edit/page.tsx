import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getCustomerById } from '@/modules/customers/queries'
import { CustomerForm } from '../../customer-form'
import { ArrowLeft } from 'lucide-react'

interface EditCustomerPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const customer = await getCustomerById(id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={`/customers/${customer.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Detalhes</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualize as informações cadastrais de {customer.name}.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <CustomerForm mode="edit" initialData={customer} />
      </div>
    </div>
  )
}