import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { hasPermission } from '@/types/auth'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Public routes
    if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Route-based permission checks
    const routePermissions: Record<string, string[]> = {
      '/people': ['people:read'],
      '/services': ['attendance:read'],
      '/groups': ['groups:read'],
      '/offerings': ['offerings:read'],
      '/events': ['events:read'],
      '/communication': ['communication:read'],
      '/admin': ['users:read'],
      '/reports': ['reports:read']
    }

    // Check permissions for protected routes
    for (const [route, permissions] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route)) {
        const hasRequiredPermission = permissions.some(permission =>
          hasPermission(token.role as any, permission)
        )
        
        if (!hasRequiredPermission) {
          return NextResponse.redirect(new URL('/unauthorized', req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|unauthorized).*)'
  ]
}

