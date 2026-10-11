'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Target, Briefcase, UserCircle, CalendarDays, PhoneForwarded, BadgeCheck, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const groups = [
  { label: 'Visão geral', items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Comercial', items: [
    { href: '/leads', label: 'Leads & Funil', icon: Target },
    { href: '/follow-ups', label: 'Follow-ups', icon: PhoneForwarded },
    { href: '/conversions', label: 'Conversões', icon: BadgeCheck },
    { href: '/revenue', label: 'Receita', icon: DollarSign },
    { href: '/customers', label: 'Clientes', icon: Users },
  ] },
  { label: 'Operacional', items: [
    { href: '/appointments', label: 'Agenda', icon: CalendarDays },
    { href: '/services', label: 'Catálogo (Serviços)', icon: Briefcase },
    { href: '/professionals', label: 'Equipe Operacional', icon: UserCircle },
  ] },
]

export function Sidebar({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const pathname = usePathname()
  return (
    <aside className={cn('flex h-full w-64 shrink-0 flex-col border-r bg-card', className)}>
      <Link href="/dashboard" onClick={onNavigate} className="flex h-16 shrink-0 items-center gap-3 border-b px-6">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">RF</span>
        <span className="text-lg font-semibold tracking-tight">RevenueFlow</span>
      </Link>
      <div className="flex-1 space-y-7 overflow-y-auto p-4">
        {groups.map((group) => (
          <nav key={group.label} aria-label={group.label} className="space-y-1">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</p>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link key={href} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined}
                  className={cn('flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors', active ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                  <Icon className="size-4 shrink-0" aria-hidden="true" />{label}
                </Link>
              )
            })}
          </nav>
        ))}
      </div>
    </aside>
  )
}
