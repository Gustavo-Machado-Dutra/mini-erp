import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getAppointmentById } from '@/modules/appointments/queries'
import { AppointmentStatusBadge } from '../status-badge'
import { AppointmentStatusSelect } from '../status-select'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Calendar, Clock, User, Sparkles, UserCheck, DollarSign, FileText } from 'lucide-react'

interface AppointmentDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const appt = await getAppointmentById(id)

  if (!appt) {
    notFound()
  }

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Agenda</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="size-6 text-blue-600" />
              <span>Agendamento de {appt.customerName}</span>
            </h1>
            <AppointmentStatusBadge status={appt.status} />
          </div>
        </div>

        <Link href={`/appointments/${appt.id}/edit`}>
          <Button className="flex items-center gap-2">
            <Edit className="size-4" />
            <span>Editar Agendamento</span>
          </Button>
        </Link>
      </div>

      <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
            Atualizar Status
          </span>
          <p className="text-sm text-blue-950 font-medium">
            Confirme, finalize ou cancele o agendamento:
          </p>
        </div>
        <AppointmentStatusSelect appointmentId={appt.id} currentStatus={appt.status} />
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Data e Hora
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="size-4 text-gray-400" />
              <span>{formatDateTime(appt.scheduledAt)}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Cliente
            </span>
            <Link
              href={`/customers/${appt.customerId}`}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
            >
              <User className="size-4" />
              <span>{appt.customerName}</span>
            </Link>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Profissional
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <UserCheck className="size-4 text-gray-400" />
              <span>{appt.professionalName}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Serviço & Preço
            </span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Sparkles className="size-4 text-blue-500" />
              <span>{appt.serviceName}</span>
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <DollarSign className="size-3" />
              {formatPrice(appt.servicePrice)} • {appt.serviceDuration} min
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <FileText className="size-3.5" />
            <span>Observações</span>
          </span>
          {appt.notes ? (
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-md">
              {appt.notes}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhuma observação informada.</p>
          )}
        </div>
      </div>
    </div>
  )
}