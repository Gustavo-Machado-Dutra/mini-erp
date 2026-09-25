import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getDashboardMetrics } from '@/modules/dashboard/queries'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  DollarSign,
  PhoneForwarded,
  Users,
  Target,
  TrendingUp,
  CalendarDays,
  Clock,
  AlertTriangle,
  Activity,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react'
import type { RecentActivity } from '@/modules/dashboard/queries'

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

const formatMonth = (key: string) => {
  const [year, month] = key.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date)
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

const STAGE_LABELS: Record<string, string> = {
  new: 'Novo lead',
  contacted: 'Contato realizado',
  interested: 'Interessado',
  scheduled: 'Agendado',
  converted: 'Convertido',
  lost: 'Perdido',
}

const STAGE_DOTS: Record<string, string> = {
  new: 'bg-slate-400',
  contacted: 'bg-sky-400',
  interested: 'bg-amber-400',
  scheduled: 'bg-violet-400',
  converted: 'bg-emerald-500',
  lost: 'bg-rose-400',
}

const ACTIVITY_ICONS: Record<RecentActivity['type'], string> = {
  conversion: 'text-emerald-600 bg-emerald-50',
  revenue: 'text-violet-600 bg-violet-50',
  follow_up: 'text-indigo-600 bg-indigo-50',
}

export default async function DashboardPage() {
  await requireSession()
  await requireOrganizationForPage()

  const metrics = await getDashboardMetrics()

  const maxMonthly = Math.max(
    ...metrics.monthlySeries.map((m) => Math.max(m.registered, m.recovered)),
    1
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Indicadores financeiros e comerciais da sua organização, com dados reais do período.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads (30 dias)</CardTitle>
            <div className="p-2 bg-sky-100/50 rounded-full">
              <Target className="size-4 text-sky-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.leads30d}</div>
            <p className="text-xs text-muted-foreground mt-1">Novos leads no período.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões (30 dias)</CardTitle>
            <div className="p-2 bg-emerald-100/50 rounded-full">
              <BadgeCheck className="size-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.conversions30d}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Taxa de conversão:{' '}
              <span className="font-medium text-emerald-600">{metrics.conversionRate}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Registrada (30 dias)</CardTitle>
            <div className="p-2 bg-violet-100/50 rounded-full">
              <DollarSign className="size-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.registeredRevenue30d)}</div>
            <p className="text-xs text-muted-foreground mt-1">Todo o valor registrado no período.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Recuperada (30 dias)</CardTitle>
            <div className="p-2 bg-emerald-100/50 rounded-full">
              <TrendingUp className="size-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(metrics.recoveredRevenue30d)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Apenas receita com evidência de atribuição (follow-up/reativação).
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups Pendentes</CardTitle>
            <div className="p-2 bg-indigo-100/50 rounded-full">
              <PhoneForwarded className="size-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.pendingFollowUps}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
              <Link href="/follow-ups?tab=today" className="flex items-center gap-1 hover:text-indigo-600">
                <CalendarDays className="size-3" /> Hoje: {metrics.todayFollowUps}
              </Link>
              <Link href="/follow-ups?tab=overdue" className="flex items-center gap-1 hover:text-rose-600">
                <AlertTriangle className="size-3" /> Atrasados: {metrics.overdueFollowUps}
              </Link>
              <Link href="/follow-ups?tab=upcoming" className="flex items-center gap-1 hover:text-indigo-600">
                <Clock className="size-3" /> Próximos: {metrics.upcomingFollowUps}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <div className="p-2 bg-sky-100/50 rounded-full">
              <Users className="size-4 text-sky-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">Volume total de clientes cadastrados.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Receita total vs Recuperada</CardTitle>
            <CardDescription>Últimos 6 meses (R$)</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-end gap-3 h-[200px] border-b border-gray-100 pb-1">
              {metrics.monthlySeries.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex flex-col items-center justify-end gap-1 flex-1">
                    <div
                      className="w-full max-w-[42px] rounded-t bg-violet-200"
                      style={{ height: `${Math.max((m.registered / maxMonthly) * 100, m.registered > 0 ? 4 : 1)}%`, minHeight: m.registered > 0 ? 8 : 2 }}
                      title={`Registrada: ${formatCurrency(m.registered)}`}
                    />
                    <div
                      className="w-full max-w-[42px] rounded-t bg-emerald-400"
                      style={{ height: `${Math.max((m.recovered / maxMonthly) * 100, m.recovered > 0 ? 4 : 1)}%`, minHeight: m.recovered > 0 ? 8 : 2 }}
                      title={`Recuperada: ${formatCurrency(m.recovered)}`}
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground capitalize">
                    {formatMonth(m.month)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-violet-200" /> Registrada
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-emerald-400" /> Recuperada
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Pipeline</CardTitle>
              <CardDescription>Oportunidades por estágio</CardDescription>
            </div>
            <Link href="/leads" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              Ver funil <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.pipeline.map((item) => {
              const maxCount = Math.max(...metrics.pipeline.map((p) => p.count), 1)
              return (
                <div key={item.stage} className="flex items-center gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700 w-40">
                    <span className={`size-2 rounded-full ${STAGE_DOTS[item.stage]}`} />
                    {STAGE_LABELS[item.stage]}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-700"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{item.count}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimos eventos comerciais da organização</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.recentActivities.length === 0 ? (
            <div className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
              <Activity className="size-5 text-gray-300" />
              Nenhuma atividade registrada ainda. Cadastre um lead ou uma conversão para começar.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {metrics.recentActivities.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3">
                  <span className={`flex size-8 items-center justify-center rounded-full ${ACTIVITY_ICONS[item.type]}`}>
                    {item.type === 'conversion' ? (
                      <BadgeCheck className="size-4" />
                    ) : item.type === 'revenue' ? (
                      <DollarSign className="size-4" />
                    ) : (
                      <PhoneForwarded className="size-4" />
                    )}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(item.occurredAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
