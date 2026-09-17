import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-session'
import { LogoutButton } from './logout-button'

export default async function DashboardPage() {
  const sessionData = await getSession()

  // Fallback de seguranca caso o middleware passe algo expirado
  if (!sessionData) {
    redirect('/login')
  }

  const { user } = sessionData

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Seus dados</h2>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>E-mail:</strong> {user.email}</p>
      </div>

      <LogoutButton />
    </div>
  )
}