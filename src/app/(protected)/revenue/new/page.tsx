import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getCustomers } from '@/modules/customers/queries'
import { getAppointments } from '@/modules/appointments/queries'
import { getConversions, getConversionById } from '@/modules/conversions/queries'
import { CONVERSION_ATTRIBUTION_LABELS } from '@/modules/conversions/types'
import { RevenueForm } from '../revenue-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isRecoveredAttributionType } from '@/modules/conversions/types'

interface NewRevenuePageProps {
  searchParams: Promise<{ conversionId?: string }>
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export default async function NewRevenuePage({ searchParams }: NewRevenuePageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { conversionId } = await searchParams

  const [customerList, appointmentList, conversionList] = await Promise.all([
    getCustomers({ limit: 100 }),
    getAppointments({ limit: 100 }),
    getConversions({ limit: 100 }),
  ])

  let preselectedConversion = null
  // O ID da URL nunca é confiado: resolvido e validado no servidor com isolamento de tenant.
  // conversionId de outra organização resolve para null (sem vazamento de dados).
  if (conversionId) {
    preselectedConversion = await getConversionById(conversionId)
  }

  if (customerList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 space-y-3">
          <h2 className="text-lg font-semibold text-amber-900">Nenhum cliente disponível</h2>
          <p className="text-sm text-amber-700">
            Para registrar receita, sua organização precisa ter pelo menos um Cliente cadastrado.
          </p>
          <div className="flex justify-center pt-2">
            <Link href="/customers/new">
              <Button size="sm">Cadastrar Cliente</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const customers = customerList.map((c) => ({ id: c.id, name: c.name }))
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
  const conversions = conversionList.map((c) => ({
    id: c.id,
    name: `${c.customerName || c.leadName || 'Sem contato'} — ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(c.amount ?? 0))}`,
  }))

  const initialConversionId = preselectedConversion?.id ?? null
  const initialCustomerId = preselectedConversion?.customerId ?? null
  const initialAmount = preselectedConversion ? Number(preselectedConversion.amount) : null

  const conversionNotice = preselectedConversion
    ? isRecoveredAttributionType(preselectedConversion.attributionType)
      ? `Receita vinculada à conversão de ${preselectedConversion.customerName || preselectedConversion.leadName || 'Sem contato'} (${CONVERSION_ATTRIBUTION_LABELS[preselectedConversion.attributionType]}) — será contabilizada como receita recuperada.`
      : `Receita vinculada à conversão de ${preselectedConversion.customerName || preselectedConversion.leadName || 'Sem contato'} (${CONVERSION_ATTRIBUTION_LABELS[preselectedConversion.attributionType]}) — será contabilizada como receita registrada, sem atribuição.`
    : null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={preselectedConversion ? `/conversions/${preselectedConversion.id}` : '/revenue'}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>
            Voltar para {preselectedConversion ? 'Conversão' : 'Receita'}
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Receita</h1>
        <p className="text-sm text-gray-500 mt-1">
          Registre um evento financeiro. A receita só é contada como recuperada quando vinculada a uma conversão com evidência de atribuição.
        </p>
        {preselectedConversion && (
          <p className="text-sm text-gray-500 mt-1">
            Valor sugerido da conversão: <span className="font-medium text-gray-700">{formatCurrency(Number(preselectedConversion.amount))}</span>
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <RevenueForm
          customers={customers}
          appointments={appointments}
          conversions={conversions}
          initialConversionId={initialConversionId}
          initialCustomerId={initialCustomerId}
          initialAmount={initialAmount}
          conversionNotice={conversionNotice}
        />
      </div>
    </div>
  )
}
