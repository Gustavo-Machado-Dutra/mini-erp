import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getProfessionals } from '@/modules/professionals/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, UserCheck, Mail, Phone, CheckCircle2, XCircle } from 'lucide-react'

interface ProfessionalsPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function ProfessionalsPage({ searchParams }: ProfessionalsPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { q } = await searchParams
  const searchQuery = q?.trim() || ''
  const professionalList = await getProfessionals({ search: searchQuery })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quadro de Profissionais</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os especialistas, atendentes e equipe operacional da empresa.
          </p>
        </div>
        <Link href="/professionals/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Novo Profissional</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <form method="GET" action="/professionals" className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar por nome, e-mail ou telefone..."
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
          {searchQuery && (
            <Link href="/professionals">
              <Button type="button" variant="outline">
                Limpar
              </Button>
            </Link>
          )}
        </form>
      </div>

      {professionalList.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <UserCheck className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Nenhum profissional cadastrado
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Cadastre os profissionais que atendem seus clientes e realizam serviços.
          </p>
          <Link href="/professionals/new">
            <Button size="sm">Cadastrar Profissional</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Profissional</th>
                  <th className="px-6 py-3">E-mail</th>
                  <th className="px-6 py-3">Telefone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {professionalList.map((prof) => (
                  <tr key={prof.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link
                        href={`/professionals/${prof.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {prof.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {prof.email ? (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail className="size-3.5 text-gray-400" />
                          <span>{prof.email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Não informado</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {prof.phone ? (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="size-3.5 text-gray-400" />
                          <span>{prof.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Não informado</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {prof.active ? (
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
                      <Link href={`/professionals/${prof.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/professionals/${prof.id}/edit`}>
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
            {professionalList.map((prof) => (
              <div key={prof.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <Link
                    href={`/professionals/${prof.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {prof.name}
                  </Link>
                  <span className="text-xs">{prof.active ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  {prof.email && <div>{prof.email}</div>}
                  {prof.phone && <div>{prof.phone}</div>}
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                  <Link href={`/professionals/${prof.id}`}>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/professionals/${prof.id}/edit`}>
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