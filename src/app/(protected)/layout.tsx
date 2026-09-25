import { AppShell } from '@/components/layout/app-shell'
import { redirect } from 'next/navigation'
import { requireSession, AuthError } from '@/modules/tenancy/context'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireSession()
  } catch (error) {
    if (error instanceof AuthError) {
      redirect('/login')
    }
    throw error
  }
  return (
    <AppShell>
      {children}
    </AppShell>
  )
}
