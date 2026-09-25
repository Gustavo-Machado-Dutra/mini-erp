import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getServices } from '@/modules/services/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Sparkles, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface ServicesPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { q } = await searchParams
  const searchQuery = q?.trim() || ''
  const serviceList = await getServices({ search: searchQuery })

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(price))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Catálogo de Serviços</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre e gerencie os serviços e procedimentos oferecidos pela sua empresa.
          </p>
        </div>
        <Link href="/services/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Novo Serviço</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <form method="GET" action="/services" className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar por nome do serviço..."
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
          {searchQuery && (
            <Link href="/services">
              <Button type="button" variant="outline">
                Limpar
              </Button>
            </Link>
          )}
        </form>
      </div>

      {serviceList.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <Sparkles className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Nenhum serviço encontrado
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Cadastre os serviços que sua empresa realiza para permitir a criação de agendamentos.
          </p>
          <Link href="/services/new">
            <Button size="sm">Cadastrar Serviço</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Serviço</th>
                  <th className="px-6 py-3">Duração</th>
                  <th className="px-6 py-3">Preço</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {serviceList.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/services/${service.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {service.name}
                      </Link>
                      {service.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {service.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Clock className="size-3.5 text-gray-400" />
                        <span>{service.durationMinutes} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatPrice(service.price)}
                    </td>
                    <td className="px-6 py-4">
                      {service.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="size-3" />
                          <span>Ativo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                          <XCircle className="size-3" />
                          <span>Inativo</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/services/${service.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/services/${service.id}/edit`}>
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

          <div className="block md:hidden divide-y divide-gray-100">
            {serviceList.map((service) => (
              <div key={service.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <Link
                    href={`/services/${service.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {service.name}
                  </Link>
                  <span className="font-semibold text-sm text-gray-900">
                    {formatPrice(service.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {service.durationMinutes} min
                  </span>
                  <span>{service.active ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                  <Link href={`/services/${service.id}`}>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/services/${service.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}