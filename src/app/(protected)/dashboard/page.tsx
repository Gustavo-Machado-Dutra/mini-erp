import Link from 'next/link'
import { requireSession, requireOrganization, getUserOrganizations } from '@/modules/tenancy/context'
import { OrgSwitcher } from './org-switcher'
import { LogoutButton } from './logout-button'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await requireSession()
  const userOrgs = await getUserOrganizations(session.user.id)

  let activeContext = null
  try {
    activeContext = await requireOrganization()
  } catch {
    // Usuário sem organização vinculada
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Ambiente de Operação Multi-Tenant</p>
          </div>
          <LogoutButton />
        </div>

        {/* Informações do Usuário */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Usuário Autenticado
          </h2>
          <div className="text-sm text-gray-800 space-y-1">
            <p><span className="font-medium text-gray-600">Nome:</span> {session.user.name}</p>
            <p><span className="font-medium text-gray-600">E-mail:</span> {session.user.email}</p>
          </div>
        </div>

        {/* Contexto da Organização Ativa */}
        {activeContext ? (
          <div className="border border-blue-100 bg-blue-50/40 rounded-md p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Organização Ativa (Tenant)
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                Papel: {activeContext.role}
              </span>
            </div>

            <div className="text-sm space-y-1 text-gray-800">
              <p><span className="font-medium text-gray-600">Nome:</span> {activeContext.organization.name}</p>
              <p><span className="font-medium text-gray-600">Slug:</span> {activeContext.organization.slug}</p>
              <p className="text-xs text-gray-400">ID: {activeContext.organization.id}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between">
              <OrgSwitcher
                organizations={userOrgs}
                currentOrgId={activeContext.organization.id}
              />
              <Link href="/organizations/new">
                <Button size="sm" variant="outline">
                  + Nova Organização
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-amber-200 bg-amber-50 rounded-md p-6 mb-6 text-center">
            <h3 className="text-base font-semibold text-amber-900 mb-1">
              Nenhuma organização encontrada
            </h3>
            <p className="text-sm text-amber-700 mb-4">
              Você ainda não possui ou não foi convidado para nenhuma empresa.
            </p>
            <Link href="/organizations/new">
              <Button>Criar Minha Primeira Organização</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}