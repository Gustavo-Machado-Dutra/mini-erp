import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getFollowUpById } from '@/modules/follow-ups/queries'
import { getCustomers } from '@/modules/customers/queries'
import { getLeads } from '@/modules/leads/queries'
import { FollowUpForm } from '../../follow-up-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditFollowUpPageProps {
  params: Promise<{ id: string }>
}

export default async function EditFollowUpPage({ params }: EditFollowUpPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const fu = await getFollowUpById(id)

  if (!fu) {
    notFound()
  }

  if (fu.status !== 'pending') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 space-y-3">
          <h2 className="text-lg font-semibold text-amber-900">
            Follow-up não editável
          </h2>
          <p className="text-sm text-amber-700">
            Apenas follow-ups pendentes podem ser editados. Este follow-up encontra-se com status{' '}
            <strong>{fu.status}</strong>.
          </p>
          <Link href={`/follow-ups/${fu.id}`}>
            <Button variant="outline">Ver Detalhes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const [customerList, leadList] = await Promise.all([
    getCustomers({ limit: 100 }),
    getLeads({ limit: 100 }),
  ])

  const customers = customerList.map((c) => ({ id: c.id, name: c.name }))
  const leads = leadList.map((l) => ({ id: l.id, name: l.name }))

  const initialData = {
    id: fu.id,
    targetType: (fu.leadId ? 'lead' : 'customer') as 'customer' | 'lead',
    customerId: fu.customerId,
    leadId: fu.leadId,
    type: fu.type,
    channel: fu.channel,
    scheduledAt: new Date(fu.scheduledAt.getTime() - fu.scheduledAt.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
    notes: fu.notes,
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={`/follow-ups/${fu.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Detalhes</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Follow-up</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualize data, canal, destinatário ou observações do follow-up.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <FollowUpForm
          mode="edit"
          initialData={initialData}
          customers={customers}
          leads={leads}
        />
      </div>
    </div>
  )
}