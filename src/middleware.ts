// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { hasPermission } from '@/types/auth'

/**
 * Middleware de autenticação + autorização.
 * - Só roda nas rotas PROTEGIDAS (veja o matcher no final).
 * - Usuário sem sessão: redireciona para /login (NÃO para /api/auth/signin).
 * - Checa permissões por prefixo de rota.
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any
    const { pathname } = req.nextUrl

    // Se o usuário autenticado estiver na home, redireciona para o dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // ===== Regras de autorização por rota (ajuste conforme necessário) =====
    const routePermissions: Record<string, string[]> = {
      '/people': ['people:read'],
      '/services': ['attendance:read'],
      '/groups': ['groups:read'],
      '/offerings': ['offerings:read'],
      '/events': ['events:read'],
      '/communication': ['communication:read'],
      '/admin': ['users:read'],
      '/reports': ['reports:read'],
    }

    // Se a rota tiver regra explícita, valida permissões do papel (role)
    for (const [prefix, required] of Object.entries(routePermissions)) {
      if (pathname.startsWith(prefix)) {
        const role: string | undefined = token?.role
        const allowed = required.some((perm) => {
          try {
            return hasPermission(role, perm)
          } catch {
            // Se houver qualquer falha inesperada, considere não autorizado
            return false
          }
        })

        if (!allowed) {
          return NextResponse.redirect(new URL('/unauthorized', req.url))
        }
        break
      }
    }

    return NextResponse.next()
  },
  {
    // Se NÃO estiver autenticado nas rotas protegidas (ver matcher), vai para /login
    pages: { signIn: '/login' },

    // Autorizado = tem token (aplicado SOMENTE nas rotas do matcher)
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// ====== IMPORTANTE ======
// Aplique o middleware APENAS nas rotas PROTEGIDAS.
// NÃO inclua /login, /unauthorized, /api/auth, _next, nem assets públicos aqui.
export const config = {
  matcher: [
    '/people/:path*',
    '/services/:path*',
    '/groups/:path*',
    '/offerings/:path*',
    '/events/:path*',
    '/communication/:path*',
    '/admin/:path*',
    '/reports/:path*',
    // Se quiser proteger a home, crie um /dashboard e proteja apenas ele.
  ],
}
