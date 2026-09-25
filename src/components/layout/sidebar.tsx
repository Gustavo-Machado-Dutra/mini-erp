import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Target,
  Briefcase,
  UserCircle,
  CalendarDays,
  PhoneForwarded,
  BadgeCheck,
  DollarSign,
} from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-full shrink-0 shadow-lg relative">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-blue-600 rounded-lg flex flex-col items-center justify-center text-white shrink-0 shadow-inner">
            <span className="font-bold font-sans text-sm tracking-tighter">RF</span>
          </div>
          <span className="font-semibold text-lg text-slate-100 tracking-tight">RevenueFlow</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
        <div>
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Visão Geral</span>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <LayoutDashboard className="size-4 text-emerald-400" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Comercial</span>
          <nav className="space-y-1">
            <Link
              href="/leads"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <Target className="size-4 text-orange-400" />
              <span>Leads & Funil</span>
            </Link>
            <Link
              href="/follow-ups"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <PhoneForwarded className="size-4 text-indigo-400" />
              <span>Follow-ups</span>
            </Link>
            <Link
              href="/conversions"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <BadgeCheck className="size-4 text-emerald-400" />
              <span>Conversões</span>
            </Link>
            <Link
              href="/revenue"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <DollarSign className="size-4 text-violet-400" />
              <span>Receita</span>
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <Users className="size-4 text-sky-400" />
              <span>Clientes</span>
            </Link>
          </nav>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Operacional</span>
          <nav className="space-y-1">
            <Link
              href="/appointments"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <CalendarDays className="size-4 text-rose-400" />
              <span>Agenda</span>
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <Briefcase className="size-4 text-violet-400" />
              <span>Catálogo (Serviços)</span>
            </Link>
            <Link
              href="/professionals"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
            >
              <UserCircle className="size-4 text-cyan-400" />
              <span>Equipe Operacional</span>
            </Link>
          </nav>
        </div>
      </div>

    </aside>
  )
}
