import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getFollowUpById } from '@/modules/follow-ups/queries'
import { FollowUpStatusBadge } from '../status-badge'
import { FollowUpActionButtons } from '../action-buttons'
import {
  FOLLOW_UP_TYPE_LABELS,
  FOLLOW_UP_CHANNEL_LABELS,
  type FollowUpType,
  type FollowUpChannel,
} from '@/modules/follow-ups/types'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Edit,
  PhoneForwarded,
  Clock,
  User,
  Target,
  Phone,
  Mail,
  CheckCircle2,
  FileText,
} from 'lucide-react'

interface FollowUpDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function FollowUpDetailPage({ params }: FollowUpDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const fu = await getFollowUpById(id)

  if (!fu) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/follow-ups"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Follow-ups</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PhoneForwarded className="size-6 text-blue-600" />
              <span>
                Follow-up:{' '}
                {fu.customerName
                  ? `Cliente ${fu.customerName}`
                  : fu.leadName
                  ? `Lead ${fu.leadName}`
                  : 'Geral'}
              </span>
            </h1>
            <FollowUpStatusBadge status={fu.status} />
          </div>
        </div>

        {fu.status === 'pending' && (
          <Link href={`/follow-ups/${fu.id}/edit`}>
            <Button className="flex items-center gap-2">
              <Edit className="size-4" />
              <span>Editar Follow-up</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Ações Rápidas quando pendente */}
      {fu.status === 'pending' && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
              Ação Operacional
            </span>
            <p className="text-sm text-blue-950 font-medium">
              Conclua o contato registrando o desfecho ou cancele este follow-up:
            </p>
          </div>
          <FollowUpActionButtons followUpId={fu.id} status={fu.status} />
        </div>
      )}

      {/* Detalhes Principais */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Data Prevista
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="size-4 text-gray-400" />
              <span>{formatDateTime(fu.scheduledAt)}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Contato Vinculado
            </span>
            {fu.customerId ? (
              <div>
                <Link
                  href={`/customers/${fu.customerId}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                >
                  <User className="size-4" />
                  <span>{fu.customerName}</span>
                </Link>
                {fu.customerPhone && (
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="size-3" />
                    {fu.customerPhone}
                  </span>
                )}
                {fu.customerEmail && (
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Mail className="size-3" />
                    {fu.customerEmail}
                  </span>
                )}
              </div>
            ) : fu.leadId ? (
              <div>
                <Link
                  href={`/leads/${fu.leadId}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:underline"
                >
                  <Target className="size-4" />
                  <span>{fu.leadName}</span>
                </Link>
                {fu.leadPhone && (
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="size-3" />
                    {fu.leadPhone}
                  </span>
                )}
                {fu.leadEmail && (
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Mail className="size-3" />
                    {fu.leadEmail}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-400">Nenhum</span>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Tipo
            </span>
            <span className="text-sm font-medium text-gray-900">
              {FOLLOW_UP_TYPE_LABELS[fu.type as FollowUpType]}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Canal
            </span>
            <span className="text-sm font-medium text-gray-900">
              {FOLLOW_UP_CHANNEL_LABELS[fu.channel as FollowUpChannel]}
            </span>
          </div>
        </div>

        {/* Desfecho / Resultado se concluído */}
        {fu.status === 'completed' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Desfecho do Contato</span>
            </span>
            <p className="text-sm text-emerald-950 font-medium whitespace-pre-line">
              {fu.outcome || 'Nenhum desfecho registrado.'}
            </p>
            {fu.executedAt && (
              <span className="text-xs text-emerald-700 block pt-1">
                Executado em: {formatDateTime(fu.executedAt)}
              </span>
            )}
          </div>
        )}

        {/* Observações */}
        <div className="pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <FileText className="size-3.5" />
            <span>Observações</span>
          </span>
          {fu.notes ? (
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-md">
              {fu.notes}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhuma observação informada.</p>
          )}
        </div>
      </div>
    </div>
  )
}