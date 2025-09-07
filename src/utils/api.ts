import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from './auth'
import { hasPermission } from '@/types/auth'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / pagination.limit)
  
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1
    }
  }
}

export function getSearchParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || undefined
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
  
  return { search, sortBy, sortOrder }
}

export async function withAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
  requiredPermissions: string[] = []
) {
  return async (request: NextRequest) => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return NextResponse.json(
          { error: 'Não autorizado' },
          { status: 401 }
        )
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasRequiredPermission = requiredPermissions.some(permission =>
          hasPermission(user.role, permission)
        )
        
        if (!hasRequiredPermission) {
          return NextResponse.json(
            { error: 'Permissão insuficiente' },
            { status: 403 }
          )
        }
      }

      return handler(request, user)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }
}

export function validateBody<T>(schema: z.ZodSchema<T>, body: any): T {
  try {
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  if (error.message.includes('Dados inválidos')) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
  
  if (error.code === 'P2002') {
    return NextResponse.json(
      { error: 'Registro já existe' },
      { status: 409 }
    )
  }
  
  if (error.code === 'P2025') {
    return NextResponse.json(
      { error: 'Registro não encontrado' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  )
}

export const commonSchemas = {
  id: z.string().cuid(),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10)
  }),
  search: z.object({
    search: z.string().optional(),
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
}

