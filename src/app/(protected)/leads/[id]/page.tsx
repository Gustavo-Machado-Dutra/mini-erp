import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getLeadById } from '@/modules/leads/queries'
import { StageBadge } from '../stage-badge'
import { StageSelect } from '../stage-select'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Mail, Phone, Calendar, Clock, User, Tag, FileText, ExternalLink } from 'lucide-react'

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const lead = await getLeadById(id)

  if (!lead) {
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
      {/* Header com Navegação e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Leads</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="size-6 text-blue-600" />
              <span>{lead.name}</span>
            </h1>
            <StageBadge stage={lead.stage} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ficha de acompanhamento comercial no pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/leads/${lead.id}/edit`}>
            <Button className="flex items-center gap-2">
              <Edit className="size-4" />
              <span>Editar Lead</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Seção de Controle Rápido de Estágio */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
            Estágio Atual do Funil
          </span>
          <p className="text-sm text-blue-950 font-medium">
            Mova o lead entre as etapas conforme o contato evoluir:
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StageSelect leadId={lead.id} currentStage={lead.stage} />
        </div>
      </div>

      {/* Card Principal de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Dados de Contato e Origem */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Informações do Contato & Origem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  E-mail
                </span>
                {lead.email ? (
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Mail className="size-4 text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">Não informado</span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Telefone / WhatsApp
                </span>
                {lead.phone ? (
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Phone className="size-4 text-gray-400" />
                    <span>{lead.phone}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">Não informado</span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Origem do Lead
                </span>
                {lead.source ? (
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded bg-gray-100 text-gray-800">
                    {lead.source}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">Não informada</span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Cliente Vinculado
                </span>
                {lead.customerName && lead.customerId ? (
                  <Link
                    href={`/customers/${lead.customerId}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <User className="size-4" />
                    <span>{lead.customerName}</span>
                    <ExternalLink className="size-3" />
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400 italic">Nenhum cliente vinculado</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <FileText className="size-3.5" />
                <span>Observações do Lead</span>
              </span>
              {lead.notes ? (
                <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {lead.notes}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Nenhuma observação registrada para este lead.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Auditoria e Metadados */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Auditoria
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Entrada no Funil
                </span>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="size-4 text-gray-400" />
                  <span>{formatDateTime(lead.createdAt)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Última Atualização
                </span>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="size-4 text-gray-400" />
                  <span>{formatDateTime(lead.updatedAt)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 block font-mono break-all">
                  ID: {lead.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}