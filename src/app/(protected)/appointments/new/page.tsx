import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getCustomers } from '@/modules/customers/queries'
import { getProfessionals } from '@/modules/professionals/queries'
import { getServices } from '@/modules/services/queries'
import { AppointmentForm } from '../appointment-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function NewAppointmentPage() {
  await requireSession()
  await requireOrganizationForPage()

  const [customerList, profList, serviceList] = await Promise.all([
    getCustomers({ limit: 100 }),
    getProfessionals({ activeOnly: true, limit: 100 }),
    getServices({ activeOnly: true, limit: 100 }),
  ])

  if (customerList.length === 0 || profList.length === 0 || serviceList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 space-y-3">
          <h2 className="text-lg font-semibold text-amber-900">
            Pré-requisitos de Agendamento
          </h2>
          <p className="text-sm text-amber-700">
            Para registrar um agendamento, sua organização precisa ter pelo menos um Cliente, um Profissional ativo e um Serviço cadastrados.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {customerList.length === 0 && (
              <Link href="/customers/new">
                <Button size="sm">Cadastrar Cliente</Button>
              </Link>
            )}
            {profList.length === 0 && (
              <Link href="/professionals/new">
                <Button size="sm">Cadastrar Profissional</Button>
              </Link>
            )}
            {serviceList.length === 0 && (
              <Link href="/services/new">
                <Button size="sm">Cadastrar Serviço</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  const customers = customerList.map((c) => ({ id: c.id, name: c.name }))
  const professionals = profList.map((p) => ({ id: p.id, name: p.name }))
  const services = serviceList.map((s) => ({
    id: s.id,
    name: s.name,
    price: s.price,
    durationMinutes: s.durationMinutes,
  }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/appointments"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Agenda</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Agendamento</h1>
        <p className="text-sm text-gray-500 mt-1">
          Marque um novo horário para realização de serviço com um cliente.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <AppointmentForm
          mode="create"
          customers={customers}
          professionals={professionals}
          services={services}
        />
      </div>
    </div>
  )
}