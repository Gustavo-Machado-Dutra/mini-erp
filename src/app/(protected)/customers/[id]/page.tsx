import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getCustomerById } from '@/modules/customers/queries'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Mail, Phone, Calendar, Clock, User, FileText } from 'lucide-react'

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const customer = await getCustomerById(id)

  if (!customer) {
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
      {/* Header com Navegacao e Acoes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Clientes</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="size-6 text-blue-600" />
            <span>{customer.name}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ficha cadastral do cliente na organização.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/customers/${customer.id}/edit`}>
            <Button className="flex items-center gap-2">
              <Edit className="size-4" />
              <span>Editar Cliente</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Card Principal de Informacoes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Dados de Contato e Notas */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Informações de Contato
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  E-mail
                </span>
                {customer.email ? (
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Mail className="size-4 text-gray-400" />
                    <span>{customer.email}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">Não informado</span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Telefone / WhatsApp
                </span>
                {customer.phone ? (
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Phone className="size-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">Não informado</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <FileText className="size-3.5" />
                <span>Observações</span>
              </span>
              {customer.notes ? (
                <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {customer.notes}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Nenhuma observação registrada para este cliente.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Metadados e Auditoria */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Auditoria do Registro
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Data de Cadastro
                </span>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="size-4 text-gray-400" />
                  <span>{formatDateTime(customer.createdAt)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Última Atualização
                </span>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="size-4 text-gray-400" />
                  <span>{formatDateTime(customer.updatedAt)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 block font-mono break-all">
                  ID: {customer.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}