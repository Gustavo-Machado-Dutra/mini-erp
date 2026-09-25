import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getServiceById } from '@/modules/services/queries'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Sparkles, Clock, DollarSign, CheckCircle2, XCircle } from 'lucide-react'

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const service = await getServiceById(id)

  if (!service) {
    notFound()
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
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Serviços</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="size-6 text-blue-600" />
            <span>{service.name}</span>
          </h1>
        </div>

        <Link href={`/services/${service.id}/edit`}>
          <Button className="flex items-center gap-2">
            <Edit className="size-4" />
            <span>Editar Serviço</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Preço
            </span>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <DollarSign className="size-5 text-gray-400" />
              <span>{formatPrice(service.price)}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Duração Estimada
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <Clock className="size-4 text-gray-400" />
              <span>{service.durationMinutes} minutos</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Status Operacional
            </span>
            {service.active ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="size-3.5" />
                <span>Ativo para agendamentos</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                <XCircle className="size-3.5" />
                <span>Inativo</span>
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
            Descrição do Procedimento
          </span>
          {service.description ? (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhuma descrição informada.</p>
          )}
        </div>
      </div>
    </div>
  )
}