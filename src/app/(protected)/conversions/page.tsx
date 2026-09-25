import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getConversions } from '@/modules/conversions/queries'
import { AttributionBadge } from './attribution-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, BadgeCheck, TrendingUp, Users } from 'lucide-react'

const formatCurrency = (val: string | null) => {
  const num = Number(val ?? 0)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export default async function ConversionsPage() {
  await requireSession()
  await requireOrganizationForPage()

  const conversions = await getConversions({ limit: 100 })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Conversões</h1>
          <p className="text-muted-foreground mt-1">
            Registre quando uma oportunidade resultou em negócio e a atribuição da receita.
          </p>
        </div>
        <Link href="/conversions/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Nova Conversão</span>
          </Button>
        </Link>
      </div>

      {conversions.length === 0 ? (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mx-auto size-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
              <BadgeCheck className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nenhuma conversão registrada</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Registre sua primeira conversão para acompanhar o desempenho comercial e a receita recuperada.
            </p>
            <Link href="/conversions/new" className="mt-6">
              <Button className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>Nova Conversão</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-0">
            <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <div className="col-span-4">Entidade</div>
              <div className="col-span-2">Atribuição</div>
              <div className="col-span-2 text-right">Valor</div>
              <div className="col-span-2">Data</div>
              <div className="col-span-2 text-right">Detalhes</div>
            </div>
            <ul className="divide-y divide-gray-100">
              {conversions.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/conversions/${c.id}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        {c.customerId ? <Users className="size-4" /> : <TrendingUp className="size-4" />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {c.customerName || c.leadName || 'Sem contato'}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {formatDate(c.convertedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <AttributionBadge attributionType={c.attributionType} />
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(c.amount)}
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground hidden md:block">
                      {formatDate(c.convertedAt)}
                    </div>
                    <div className="col-span-2 text-right text-sm text-indigo-600 hidden md:block">
                      Ver detalhes
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
