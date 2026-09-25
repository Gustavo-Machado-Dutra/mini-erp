import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getRevenueById } from '@/modules/revenue/queries'
import { RevenueStatusBadge } from '../status-badge'
import { AttributionBadge } from '../../conversions/attribution-badge'
import { REVENUE_SOURCE_LABELS } from '@/modules/revenue/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Users, Coins, CalendarDays, CircleSlash, BadgeCheck } from 'lucide-react'

interface RevenueDetailPageProps {
  params: Promise<{ id: string }>
}

const formatCurrency = (val: string | null) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val ?? 0))

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export default async function RevenueDetailPage({ params }: RevenueDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const revenue = await getRevenueById(id)

  if (!revenue) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/revenue"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Receita</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Detalhes da Receita</h1>
        <div className="mt-2 flex items-center gap-2">
          <RevenueStatusBadge status={revenue.status} />
          {revenue.conversionId && revenue.conversionAttributionType && (
            <AttributionBadge attributionType={revenue.conversionAttributionType} />
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="size-4 text-gray-400" /> Valor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(revenue.amount)}</p>
            <p className="text-xs text-muted-foreground mt-1">Moeda: {revenue.currency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="size-4 text-gray-400" /> Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{revenue.customerName || 'Sem cliente'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="size-4 text-gray-400" /> Data da receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{formatDate(revenue.occurredAt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CircleSlash className="size-4 text-gray-400" /> Origem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{REVENUE_SOURCE_LABELS[revenue.source]}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BadgeCheck className="size-4 text-gray-400" /> Atribuição
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenue.conversionId ? (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900">Receita vinculada a conversão</p>
              {revenue.conversionAttributionType ? (
                <AttributionBadge attributionType={revenue.conversionAttributionType} />
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sem conversão vinculada — esta receita não é contabilizada como recuperada.
            </p>
          )}
        </CardContent>
      </Card>

      {revenue.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{revenue.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
