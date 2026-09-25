import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getLeads, getLeadsGroupedByStage } from '@/modules/leads/queries'
import type { LeadStage } from '@/db/schema/leads'
import { LEAD_STAGES } from '@/modules/leads/types'
import { PipelineView } from './pipeline-view'
import { StageBadge } from './stage-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Kanban, List, Users, Phone, Mail, Tag } from 'lucide-react'

interface LeadsPageProps {
  searchParams: Promise<{ q?: string; view?: string; stage?: string }>
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  await requireSession()

  await requireOrganizationForPage()

  const { q, view, stage } = await searchParams
  const searchQuery = q?.trim() || ''
  const currentView = view === 'list' ? 'list' : 'pipeline'
  const filterStage = stage && LEAD_STAGES.includes(stage as LeadStage) ? (stage as LeadStage) : undefined

  const stageGroups = await getLeadsGroupedByStage(searchQuery)
  const allLeads = await getLeads({
    search: searchQuery,
    stage: filterStage,
  })

  const totalLeads = stageGroups.reduce((acc, g) => acc + g.count, 0)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leads & Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o funil de vendas e o avanÃƒÂ§o das oportunidades comerciais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Alternador de VisualizaÃƒÂ§ÃƒÂ£o */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
            <Link
              href={`/leads?view=pipeline${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentView === 'pipeline'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Kanban className="size-3.5" />
              <span>Pipeline</span>
            </Link>
            <Link
              href={`/leads?view=list${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentView === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="size-3.5" />
              <span>Lista</span>
            </Link>
          </div>

          <Link href="/leads/new">
            <Button className="flex items-center gap-2">
              <Plus className="size-4" />
              <span>Novo Lead</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
        <form method="GET" action="/leads" className="flex gap-2">
          <input type="hidden" name="view" value={currentView} />
          {filterStage && <input type="hidden" name="stage" value={filterStage} />}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar por nome do lead, e-mail, telefone ou origem..."
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
          {(searchQuery || filterStage) && (
            <Link href={`/leads?view=${currentView}`}>
              <Button type="button" variant="outline">
                Limpar Filtros
              </Button>
            </Link>
          )}
        </form>

        {/* Filtros RÃƒÂ¡pidos por EstÃƒÂ¡gio (Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="text-gray-400 font-medium whitespace-nowrap">EstÃƒÂ¡gios:</span>
          <Link
            href={`/leads?view=${currentView}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
            className={`px-2.5 py-1 rounded-full border whitespace-nowrap font-medium transition-colors ${
              !filterStage
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            Todos ({totalLeads})
          </Link>
          {stageGroups.map((group) => (
            <Link
              key={group.stage}
              href={`/leads?view=${currentView}&stage=${group.stage}${
                searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''
              }`}
              className={`px-2.5 py-1 rounded-full border whitespace-nowrap font-medium transition-colors ${
                filterStage === group.stage
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {group.label} ({group.count})
            </Link>
          ))}
        </div>
      </div>

      {/* ConteÃƒÂºdo Principal: Pipeline ou Lista */}
      {currentView === 'pipeline' ? (
        <PipelineView stageGroups={stageGroups} />
      ) : (
        /* VisualizaÃƒÂ§ÃƒÂ£o em Lista */
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {allLeads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <Tag className="size-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Nenhum lead encontrado
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery
                  ? `Nenhum resultado corresponde a "${searchQuery}".`
                  : 'NÃƒÂ£o hÃƒÂ¡ leads cadastrados neste estÃƒÂ¡gio.'}
              </p>
              <Link href="/leads/new">
                <Button size="sm">Cadastrar Lead</Button>
              </Link>
            </div>
          ) : (
            <div>
              {/* Tabela Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Lead / Oportunidade</th>
                      <th className="px-6 py-3">EstÃƒÂ¡gio</th>
                      <th className="px-6 py-3">Origem</th>
                      <th className="px-6 py-3">Contato</th>
                      <th className="px-6 py-3">Cliente</th>
                      <th className="px-6 py-3">Cadastrado em</th>
                      <th className="px-6 py-3 text-right">AÃƒÂ§ÃƒÂµes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {lead.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <StageBadge stage={lead.stage} />
                        </td>
                        <td className="px-6 py-4">
                          {lead.source ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                              {lead.source}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5 text-xs text-gray-600">
                            {lead.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="size-3 text-gray-400" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                            {lead.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="size-3 text-gray-400" />
                                <span>{lead.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {lead.customerName ? (
                            <Link
                              href={`/customers/${lead.customerId}`}
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Users className="size-3" />
                              <span>{lead.customerName}</span>
                            </Link>
                          ) : (
                            <span className="text-gray-400 italic">NÃƒÂ£o vinculado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link href={`/leads/${lead.id}`}>
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                          </Link>
                          <Link href={`/leads/${lead.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile */}
              <div className="block md:hidden divide-y divide-gray-100">
                {allLeads.map((lead) => (
                  <div key={lead.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {lead.name}
                      </Link>
                      <StageBadge stage={lead.stage} />
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      {lead.source && (
                        <div className="text-gray-500">
                          Origem: <strong className="text-gray-700">{lead.source}</strong>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="size-3 text-gray-400" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="size-3 text-gray-400" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                      {lead.customerName && (
                        <div className="text-blue-600 font-medium">
                          Cliente: {lead.customerName}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-400">
                      <span>{formatDate(lead.createdAt)}</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                        </Link>
                        <Link href={`/leads/${lead.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RodapÃƒÂ© da Lista */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                <span>
                  Total listados: <strong>{allLeads.length}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}