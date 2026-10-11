'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'

export function Header() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/login')
  }

  return (
    <header className="h-16 shrink-0 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-20">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:mr-4">Pular para o conteúdo</a>
      <div className="flex flex-1 items-center gap-3">
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu de navegação"><Menu className="size-5" /></Button></DialogTrigger>
          <DialogContent aria-describedby={undefined} className="left-0 top-0 h-dvh w-[min(20rem,90vw)] max-w-none translate-x-0 translate-y-0 gap-0 rounded-none p-0 sm:rounded-none">
            <DialogTitle className="sr-only">Menu de navegação</DialogTitle>
            <Sidebar className="w-full" onNavigate={() => setMenuOpen(false)} />
          </DialogContent>
        </Dialog>
        <span className="text-sm font-medium text-muted-foreground">Gestão comercial</span>
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" aria-label="Minha conta" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium leading-none">Minha Conta</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
