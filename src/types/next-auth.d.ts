import { Role } from '@prisma/client'
import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: Role
      personId?: string
      person?: {
        id: string
        firstName: string
        lastName: string
        fullName: string
        photo?: string
      }
      /**
       * Permissões opcionais: marque como opcional para não quebrar o tipo
       * quando não forem preenchidas no callback.
       */
      permissions?: string[]
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    role: Role
    personId?: string
    person?: {
      id: string
      firstName: string
      lastName: string
      fullName: string
      photo?: string
    }
    permissions?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email?: string
    name?: string
    role: Role
    personId?: string
    person?: {
      id: string
      firstName: string
      lastName: string
      fullName: string
      photo?: string
    }
    permissions?: string[]
  }
}
