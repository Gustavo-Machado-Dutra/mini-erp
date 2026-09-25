import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getFollowUps, getFollowUpCounts } from '@/modules/follow-ups/queries'
import { FollowUpStatusBadge } from './status-badge'
import { FollowUpActionButtons } from './action-buttons'
import {
  FOLLOW_UP_TYPE_LABELS,
  FOLLOW_UP_CHANNEL_LABELS,
  type FollowUpType,
  type FollowUpChannel,
} from '@/modules/follow-ups/types'
import { Button } from '@/components/ui/button'
import {
  Plus,
  PhoneForwarded,
  Clock,
  User,
  Target,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react'

interface FollowUpsPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function FollowUpsPage({ searchParams }: FollowUpsPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { tab } = await searchParams
  const currentTab = (tab as 'today' | 'overdue' | 'upcoming' | 'completed' | 'all') || 'today'

  const [followUpList, counts] = await Promise.all([
    getFollowUps({ period: currentTab }),
    getFollowUpCounts(),
  ])

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getChannelIcon = (channel: FollowUpChannel) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="size-3.5 text-emerald-600" />
      case 'phone':
        return <Phone className="size-3.5 text-blue-600" />
      case 'email':
        return <Mail className="size-3.5 text-purple-600" />
      default:
        return <PhoneForwarded className="size-3.5 text-gray-500" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Follow-ups Comerciais</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe contatos agendados, reativações de clientes e follow-ups de orçamentos.
          </p>
        </div>
        <Link href="/follow-ups/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Novo Follow-up</span>
          </Button>
        </Link>
      </div>

      {/* Tabs com contadores */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <Link
          href="/follow-ups?tab=today"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            currentTab === 'today'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Hoje</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              currentTab === 'today' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {counts.today}
          </span>
        </Link>
        <Link
          href="/follow-ups?tab=overdue"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            currentTab === 'overdue'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Atrasados</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              counts.overdue > 0
                ? 'bg-rose-100 text-rose-800 font-bold'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {counts.overdue}
          </span>
        </Link>
        <Link
          href="/follow-ups?tab=upcoming"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            currentTab === 'upcoming'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Próximos</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              currentTab === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {counts.upcoming}
          </span>
        </Link>
        <Link
          href="/follow-ups?tab=completed"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            currentTab === 'completed'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Concluídos</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              currentTab === 'completed'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {counts.completed}
          </span>
        </Link>
        <Link
          href="/follow-ups?tab=all"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            currentTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Todos</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              currentTab === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {counts.all}
          </span>
        </Link>
      </div>

      {followUpList.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <PhoneForwarded className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Nenhum follow-up encontrado
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Não há tarefas de contato registradas para a visualização selecionada.
          </p>
          <Link href="/follow-ups/new">
            <Button size="sm">Agendar Primeiro Follow-up</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Tabela Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Data Prevista</th>
                  <th className="px-6 py-3">Contato / Destinatário</th>
                  <th className="px-6 py-3">Tipo & Canal</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Desfecho / Resultado</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {followUpList.map((fu) => (
                  <tr key={fu.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4 text-gray-400" />
                        <span>{formatDateTime(fu.scheduledAt)}</span>
                      </div>
                      {fu.executedAt && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          Executado: {formatDateTime(fu.executedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {fu.customerId ? (
                        <div>
                          <Link
                            href={`/customers/${fu.customerId}`}
                            className="font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1"
                          >
                            <User className="size-3.5 text-blue-500" />
                            <span>{fu.customerName}</span>
                          </Link>
                          {fu.customerPhone && (
                            <span className="text-xs text-gray-400 block">{fu.customerPhone}</span>
                          )}
                        </div>
                      ) : fu.leadId ? (
                        <div>
                          <Link
                            href={`/leads/${fu.leadId}`}
                            className="font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1"
                          >
                            <Target className="size-3.5 text-purple-500" />
                            <span>{fu.leadName}</span>
                          </Link>
                          {fu.leadPhone && (
                            <span className="text-xs text-gray-400 block">{fu.leadPhone}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sem vínculo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-xs">
                        {FOLLOW_UP_TYPE_LABELS[fu.type as FollowUpType]}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        {getChannelIcon(fu.channel as FollowUpChannel)}
                        <span>{FOLLOW_UP_CHANNEL_LABELS[fu.channel as FollowUpChannel]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <FollowUpStatusBadge status={fu.status} />
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {fu.outcome ? (
                        <p className="text-xs text-gray-700 truncate" title={fu.outcome}>
                          {fu.outcome}
                        </p>
                      ) : fu.notes ? (
                        <p className="text-xs text-gray-400 italic truncate" title={fu.notes}>
                          Obs: {fu.notes}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <FollowUpActionButtons followUpId={fu.id} status={fu.status} compact />
                      <Link href={`/follow-ups/${fu.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                      {fu.status === 'pending' && (
                        <Link href={`/follow-ups/${fu.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile */}
          <div className="block md:hidden divide-y divide-gray-100">
            {followUpList.map((fu) => (
              <div key={fu.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                      <Clock className="size-3.5 text-gray-400" />
                      {formatDateTime(fu.scheduledAt)}
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {FOLLOW_UP_TYPE_LABELS[fu.type as FollowUpType]}
                    </span>
                  </div>
                  <FollowUpStatusBadge status={fu.status} />
                </div>

                <div className="space-y-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded">
                  <div>
                    Contato:{' '}
                    <strong>
                      {fu.customerName
                        ? `Cliente: ${fu.customerName}`
                        : fu.leadName
                        ? `Lead: ${fu.leadName}`
                        : 'N/A'}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1">
                    Canal: {getChannelIcon(fu.channel as FollowUpChannel)}
                    <span>{FOLLOW_UP_CHANNEL_LABELS[fu.channel as FollowUpChannel]}</span>
                  </div>
                  {fu.outcome && (
                    <div className="text-emerald-800 pt-1">
                      <strong>Desfecho:</strong> {fu.outcome}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <FollowUpActionButtons followUpId={fu.id} status={fu.status} compact />
                  <div className="space-x-1">
                    <Link href={`/follow-ups/${fu.id}`}>
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
              Total nesta exibição: <strong>{followUpList.length}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}