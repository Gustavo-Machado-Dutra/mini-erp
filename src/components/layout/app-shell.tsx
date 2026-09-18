import { Sidebar } from './sidebar'
import { Header } from './header'

export function AppShell({ children, header }: { children: React.ReactNode, header: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header>{header}</Header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}