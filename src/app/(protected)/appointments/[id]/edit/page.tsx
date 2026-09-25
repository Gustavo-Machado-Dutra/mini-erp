import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getAppointmentById } from '@/modules/appointments/queries'
import { getCustomers } from '@/modules/customers/queries'
import { getProfessionals } from '@/modules/professionals/queries'
import { getServices } from '@/modules/services/queries'
import { AppointmentForm } from '../../appointment-form'
import { ArrowLeft } from 'lucide-react'

interface EditAppointmentPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAppointmentPage({ params }: EditAppointmentPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const appt = await getAppointmentById(id)

  if (!appt) {
    notFound()
  }

  const [customerList, profList, serviceList] = await Promise.all([
    getCustomers({ limit: 100 }),
    getProfessionals({ limit: 100 }),
    getServices({ limit: 100 }),
  ])

  const customers = customerList.map((c) => ({ id: c.id, name: c.name }))
  const professionals = profList.map((p) => ({ id: p.id, name: p.name }))
  const services = serviceList.map((s) => ({
    id: s.id,
    name: s.name,
    price: s.price,
    durationMinutes: s.durationMinutes,
  }))

  const initialData = {
    id: appt.id,
    customerId: appt.customerId,
    professionalId: appt.professionalId,
    serviceId: appt.serviceId,
    scheduledAt: new Date(appt.scheduledAt.getTime() - appt.scheduledAt.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
    status: appt.status,
    notes: appt.notes,
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={`/appointments/${appt.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Detalhes</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Agendamento</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualize data, horário, serviço ou profissional do atendimento.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <AppointmentForm
          mode="edit"
          initialData={initialData}
          customers={customers}
          professionals={professionals}
          services={services}
        />
      </div>
    </div>
  )
}