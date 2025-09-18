import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { AuthUser, ROLE_PERMISSIONS } from '@/types/auth'

export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            person: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                fullName: true,
                photo: true
              }
            }
          }
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return user
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Se o provedor for credenciais, o usuário já foi validado no authorize
      if (account?.provider === "credentials") {
        return true
      }
      // Para outros provedores (ex: OAuth), você pode adicionar lógica aqui
      // para verificar se o usuário já existe e associá-lo ou criar um novo.
      // Por enquanto, permitimos o login para provedores não-credenciais.
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUser).role
        token.personId = (user as AuthUser).personId
        token.person = (user as AuthUser).person
        token.permissions = ROLE_PERMISSIONS[(user as AuthUser).role] || []
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.personId = token.personId as string
        session.user.person = token.person as any
        session.user.permissions = token.permissions as string[]
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

