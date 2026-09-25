import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getRevenue, getRevenueTotals } from '@/modules/revenue/queries'
import { RevenueStatusBadge } from './status-badge'
import { REVENUE_SOURCE_LABELS } from '@/modules/revenue/types'
import { AttributionBadge } from '../conversions/attribution-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, DollarSign, TrendingUp, CircleSlash } from 'lucide-react'

const formatCurrency = (val: string | null | number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val ?? 0))

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export default async function RevenuePage() {
  await requireSession()
  await requireOrganizationForPage()

  const [revenueList, totals] = await Promise.all([getRevenue({ limit: 100 }), getRevenueTotals()])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Receita</h1>
          <p className="text-muted-foreground mt-1">
            Eventos financeiros registrados e receita recuperada com evidência de atribuição.
          </p>
        </div>
        <Link href="/revenue/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Nova Receita</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <DollarSign className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Receita Registrada</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totals.registered)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Receita Recuperada</p>
              <p className="text-xl font-bold text-emerald-700">{formatCurrency(totals.recovered)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <CircleSlash className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Sem Atribuição</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totals.unassigned)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {revenueList.length === 0 ? (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mx-auto size-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 mb-4 ring-8 ring-violet-50/50">
              <DollarSign className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nenhuma receita registrada</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Registre o primeiro evento financeiro para acompanhar o faturamento da organização.
            </p>
            <Link href="/revenue/new" className="mt-6">
              <Button className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>Nova Receita</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-0">
            <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <div className="col-span-3">Cliente</div>
              <div className="col-span-2 text-right">Valor</div>
              <div className="col-span-2">Atribuição</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Data</div>
              <div className="col-span-1 text-right">Ver</div>
            </div>
            <ul className="divide-y divide-gray-100">
              {revenueList.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/revenue/${r.id}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                  >
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-gray-900">{r.customerName || 'Sem cliente'}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {REVENUE_SOURCE_LABELS[r.source]} · {formatDate(r.occurredAt)}
                      </p>
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(r.amount)}
                    </div>
                    <div className="col-span-2">
                      {r.conversionId && r.conversionAttributionType ? (
                        <AttributionBadge attributionType={r.conversionAttributionType} />
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem conversão</span>
                      )}
                    </div>
                    <div className="col-span-2 hidden md:block">
                      <RevenueStatusBadge status={r.status} />
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground hidden md:block">
                      {formatDate(r.occurredAt)}
                    </div>
                    <div className="col-span-1 text-right text-sm text-indigo-600 hidden md:block">
                      Ver
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
