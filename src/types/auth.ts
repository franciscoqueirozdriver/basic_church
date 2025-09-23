import { Role } from '@prisma/client'

export interface User {
  id: string
  email: string
  name?: string | null
  role: Role
}

export interface AuthUser extends User {
  person?: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
  } | null
}
