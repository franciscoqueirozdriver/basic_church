import { Role } from '@prisma/client'
import NextAuth from 'next-auth'

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
      permissions: string[]
    }
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
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    personId?: string
    person?: {
      id: string
      firstName: string
      lastName: string
      fullName: string
      photo?: string
    }
    permissions: string[]
  }
}

