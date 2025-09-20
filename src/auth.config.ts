// src/auth.config.ts
import type { NextAuthOptions } from 'next-auth'

/**
 * Configuração base do NextAuth usada pela rota [...nextauth].
 * - Sessão via JWT
 * - Enriquecimento do token/sessão com id e role (enum do seu schema)
 * - Página de login customizada em /login
 */
export const authConfig: NextAuthOptions = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      // Na primeira emissão após login via Credentials, 'user' vem do authorize()
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role ?? 'MEMBRO'
        token.name = user.name
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      if (session?.user) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).role = (token.role as string) || 'MEMBRO'
        session.user.name = (token.name as string) ?? session.user.name ?? ''
        session.user.email = (token.email as string) ?? session.user.email ?? ''
      }
      return session
    },
  },

  // Logs verbosos só em desenvolvimento
  debug: process.env.NODE_ENV === 'development',
}
