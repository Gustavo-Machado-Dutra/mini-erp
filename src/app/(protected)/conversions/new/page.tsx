import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getCustomers } from '@/modules/customers/queries'
import { getLeads } from '@/modules/leads/queries'
import { getAppointments } from '@/modules/appointments/queries'
import { ConversionForm } from '../conversion-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function NewConversionPage() {
  await requireSession()
  await requireOrganizationForPage()

  const [customerList, leadList, appointmentList] = await Promise.all([
    getCustomers({ limit: 100 }),
    getLeads({ limit: 100 }),
    getAppointments({ limit: 100 }),
  ])

  if (customerList.length === 0 && leadList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 space-y-3">
          <h2 className="text-lg font-semibold text-amber-900">Nenhum contato disponível</h2>
          <p className="text-sm text-amber-700">
            Para registrar uma conversão, sua organização precisa ter pelo menos um Cliente ou Lead cadastrado.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/customers/new">
              <Button size="sm">Cadastrar Cliente</Button>
            </Link>
            <Link href="/leads/new">
              <Button size="sm">Cadastrar Lead</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const customers = customerList.map((c) => ({ id: c.id, name: c.name }))
  const leads = leadList.map((l) => ({ id: l.id, name: l.name }))
  const appointments = appointmentList.map((a) => ({
    id: a.id,
    name: a.customerName
      ? `${a.customerName} — ${new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(a.scheduledAt))}`
      : 'Agendamento',
  }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/conversions"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Conversões</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Conversão</h1>
        <p className="text-sm text-gray-500 mt-1">
          Registre quando uma oportunidade resultou em negócio e indique a atribuição.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <ConversionForm customers={customers} leads={leads} appointments={appointments} />
      </div>
    </div>
  )
}
