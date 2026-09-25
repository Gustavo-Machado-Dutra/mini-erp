import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getAppointments } from '@/modules/appointments/queries'
import { AppointmentStatusBadge } from './status-badge'
import { AppointmentStatusSelect } from './status-select'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Clock, User, Sparkles, Phone } from 'lucide-react'

interface AppointmentsPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { tab } = await searchParams
  const currentTab = (tab as 'today' | 'upcoming' | 'past' | 'all') || 'today'

  const appointmentList = await getAppointments({ period: currentTab })

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(price))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Agenda de Atendimentos</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe a escala de serviços e os compromissos dos seus clientes.
          </p>
        </div>
        <Link href="/appointments/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Novo Agendamento</span>
          </Button>
        </Link>
      </div>

      {/* Navegação por Abas (Hoje, Próximos, Atrasados/Histórico, Todos) */}
      <div className="flex border-b border-gray-200">
        <Link
          href="/appointments?tab=today"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            currentTab === 'today'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Hoje
        </Link>
        <Link
          href="/appointments?tab=upcoming"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            currentTab === 'upcoming'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Próximos
        </Link>
        <Link
          href="/appointments?tab=past"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            currentTab === 'past'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Atrasados / Histórico
        </Link>
        <Link
          href="/appointments?tab=all"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            currentTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Todos
        </Link>
      </div>

      {appointmentList.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <Calendar className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Não há atendimentos registrados para o período selecionado.
          </p>
          <Link href="/appointments/new">
            <Button size="sm">Novo Agendamento</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Data e Hora</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Serviço</th>
                  <th className="px-6 py-3">Profissional</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointmentList.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4 text-gray-400" />
                        <span>{formatDateTime(appt.scheduledAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/customers/${appt.customerId}`}
                        className="font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1"
                      >
                        <User className="size-3.5 text-gray-400" />
                        <span>{appt.customerName}</span>
                      </Link>
                      {appt.customerPhone && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Phone className="size-3" />
                          <span>{appt.customerPhone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-900 font-medium">
                        <Sparkles className="size-3.5 text-blue-500" />
                        <span>{appt.serviceName}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {appt.serviceDuration} min • {formatPrice(appt.servicePrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {appt.professionalName}
                    </td>
                    <td className="px-6 py-4">
                      <AppointmentStatusSelect
                        appointmentId={appt.id}
                        currentStatus={appt.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/appointments/${appt.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/appointments/${appt.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block md:hidden divide-y divide-gray-100">
            {appointmentList.map((appt) => (
              <div key={appt.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                    <Clock className="size-3.5 text-gray-400" />
                    {formatDateTime(appt.scheduledAt)}
                  </span>
                  <AppointmentStatusBadge status={appt.status} />
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>
                    Cliente: <strong>{appt.customerName}</strong>
                  </div>
                  <div>
                    Serviço: <strong>{appt.serviceName}</strong> ({formatPrice(appt.servicePrice)})
                  </div>
                  <div>
                    Profissional: <strong>{appt.professionalName}</strong>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <AppointmentStatusSelect
                    appointmentId={appt.id}
                    currentStatus={appt.status}
                  />
                  <div className="space-x-1">
                    <Link href={`/appointments/${appt.id}`}>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>
              Total de agendamentos no período: <strong>{appointmentList.length}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}