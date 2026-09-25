import Link from 'next/link'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getCustomers } from '@/modules/customers/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, Users, Mail, Phone, Calendar } from 'lucide-react'

interface CustomersPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  await requireSession()

  await requireOrganizationForPage()

  const { q } = await searchParams
  const customers = await getCustomers({ search: q })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie a base de clientes do seu negÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³cio.</p>
        </div>
        <Link href="/customers/new">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            <span>Novo Cliente</span>
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border-gray-200">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <form className="relative max-w-md w-full" action="/customers" method="GET">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Buscar por nome, email ou telefone..."
              className="pl-9 h-10 bg-white"
            />
          </form>
        </div>

        {customers.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mx-auto size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 ring-8 ring-blue-50/50">
              <Users className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum cliente encontrado</h3>
            {q ? (
              <p className="text-sm text-gray-500 max-w-sm mb-6">Nenhum resultado para &quot;{q}&quot;. Tente outros termos.</p>
            ) : (
              <p className="text-sm text-gray-500 max-w-sm mb-6">Comece cadastrando o seu primeiro cliente e inicie a rastreabilidade comercial.</p>
            )}
            <Link href="/customers/new">
              <Button>Cadastrar Cliente</Button>
            </Link>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4">Data de Cadastro</th>
                  <th className="px-6 py-4 text-right">AÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{c.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 space-y-1">
                      {c.email && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="size-3 text-gray-400" />
                          <span>{c.email}</span>
                        </div>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="size-3 text-gray-400" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                      {!c.email && !c.phone && <span className="text-xs italic text-gray-400">Sem contato detalhado</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3 text-gray-400" />
                        {formatDate(c.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/customers/${c.id}`}>
                          <Button variant="ghost" size="sm" className="h-8">Visualizar</Button>
                        </Link>
                        <Link href={`/customers/${c.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8">Editar</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {customers.length > 0 && (
         <div className="text-xs text-muted-foreground text-right px-1">
            Mostrando <b>{customers.length}</b> registros.
         </div>
      )}
    </div>
  )
}