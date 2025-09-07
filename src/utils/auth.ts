import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionUser } from '@/types/auth'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  return session?.user as SessionUser || null
}

export function generateRandomPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

