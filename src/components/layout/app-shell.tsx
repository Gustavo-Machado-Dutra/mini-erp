import { Sidebar } from './sidebar'
import { Header } from './header'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 hidden h-dvh lg:block"><Sidebar /></div>
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 md:p-6 lg:p-8 bg-background"><div className="mx-auto w-full max-w-[1440px]">{children}</div></main>
      </div>
    </div>
  )
}
