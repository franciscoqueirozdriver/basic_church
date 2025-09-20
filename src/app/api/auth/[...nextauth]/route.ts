// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

/**
 * Prisma singleton para evitar múltiplas conexões em dev (Next.js hot reload).
 */
const prisma =
  (globalThis as any).__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
if (process.env.NODE_ENV !== 'production') {
  ;(globalThis as any).__prisma = prisma
}

/**
 * Normaliza e valida email básico.
 */
function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export const authOptions: NextAuthOptions = {
  /**
   * Usamos JWT para sessões (stateless).
   */
  session: { strategy: 'jwt' },

  /**
   * Secret obrigatória para assinar/validar tokens.
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * Provedores — credenciais (email/senha) via banco.
   */
  providers: [
    Credentials({
      name: 'Credenciais',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = normalizeEmail(credentials.email)

        const user = await prisma.user.findUnique({
          where: { email },
          include: { person: true },
        })

        // Usuário inexistente, sem senha definida ou inativo => falha.
        if (!user?.password || user.isActive === false) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        // Retorno mínimo necessário; qualquer campo extra será propagado ao token no callback jwt.
        return {
          id: user.id,
          email: user.email,
          name: user.person?.fullName ?? user.email,
          role: user.role,
        } as any
      },
    }),
  ],

  /**
   * Página customizada de login.
   * OBS: Se houver loop de redirecionamento, verifique se sua página /login
   * não está chamando signIn() automaticamente nem protegida por middleware.
   */
  pages: {
    signIn: '/login',
  },

  /**
   * Callbacks para enriquecer token e sessão.
   */
  callbacks: {
    /**
     * Executa ao criar/atualizar o JWT.
     */
    async jwt({ token, user }) {
      // Na primeira emissão, 'user' vem do authorize()
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.name = (user as any).name
        token.email = (user as any).email
      }
      return token
    },

    /**
     * Executa a cada chamada de sessão no cliente/servidor.
     */
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        // Garante consistência de nome/email vindos do token
        session.user.name = token.name ?? session.user.name ?? ''
        session.user.email = (token.email as string) ?? session.user.email ?? ''
      }
      return session
    },

    /**
     * Controle de redirecionamento pós-login/logout.
     * (Não interfere no redirecionamento para a página de login.)
     * Evita callbackUrl malformada/externa.
     */
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl)
        // Evita loops caso callback aponte explicitamente para /login
        if (target.pathname === '/login') return baseUrl
        // Permite apenas a mesma origem
        if (target.origin === baseUrl) return target.toString()
      } catch {
        /* ignore */
      }
      return baseUrl
    },
  },

  /**
   * Logs de debug apenas em desenvolvimento.
   */
  debug: process.env.NODE_ENV === 'development',
}

/**
 * Handlers GET/POST para a rota de autenticação.
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
