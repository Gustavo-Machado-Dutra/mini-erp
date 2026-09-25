import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mapeamento de rotas protegidas (exigem estar logado)
const protectedRoutes = [
  '/dashboard',
  '/customers',
  '/leads',
  '/services',
  '/professionals',
  '/appointments',
  '/follow-ups',
  '/conversions',
  '/revenue',
]

// Mapeamento de rotas exclusivas para nao logados (ex: nao deve acessar /login se ja estiver logado)
const guestOnlyRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // No Better Auth, o cookie de sessão padrao comeca com better-auth.session_token
  // Porem e melhor ser permissivo na checagem rapida do edge e deixar a API
  // confirmar real auth no lado do servidor.
  const sessionCookie = request.cookies.get('better-auth.session_token') || 
                        request.cookies.get('__Secure-better-auth.session_token')
                        
  const hasSession = !!sessionCookie

  // Redireciona nao logado tentando acessar rota protegida
  if (!hasSession && protectedRoutes.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redireciona usuario logado tentando acessar login/register
  if (hasSession && guestOnlyRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configura o matcher para não rodar middleware em assets estaticos e _next
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
