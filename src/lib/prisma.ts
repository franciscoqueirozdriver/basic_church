// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

/**
 * Evita múltiplas instâncias do Prisma Client em dev (hot-reload do Next.js).
 * Em produção cria apenas uma instância.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Em dev mostramos avisos/erros; em prod, apenas erros.
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
