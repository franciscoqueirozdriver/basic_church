'use client'

import type { ReactNode } from 'react'
import type { Session } from 'next-auth'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

interface SessionProviderProps {
  children: ReactNode
  /**
   * Opcional: passe a sessão obtida no server (se usar fetch/SSR).
   * Se não passar, o provider buscará a sessão no cliente.
   */
  session?: Session | null
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      {children}
    </NextAuthSessionProvider>
  )
}
