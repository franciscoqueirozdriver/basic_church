import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withAuth, 
  getPaginationParams, 
  createPaginatedResponse, 
  validateBody, 
  handleApiError 
} from '@/utils/api'
import { createServiceSchema, serviceFilterSchema } from '@/schemas/services'

// GET /api/services - List services with filters and pagination
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const pagination = getPaginationParams(request)
    
    // Parse filters
    const filters = serviceFilterSchema.parse({
      search: searchParams.get('search'),
      type: searchParams.get('type'),
      campusId: searchParams.get('campusId'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      isActive: searchParams.get('isActive') === 'true',
      sortBy: searchParams.get('sortBy') || 'date',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    })

    // Build where clause
    const where: any = {}
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    if (filters.type) where.type = filters.type
    if (filters.campusId) where.campusId = filters.campusId
    if (filters.isActive !== undefined) where.isActive = filters.isActive
    
    if (filters.dateFrom) {
      where.date = { ...where.date, gte: new Date(filters.dateFrom) }
    }
    if (filters.dateTo) {
      where.date = { ...where.date, lte: new Date(filters.dateTo) }
    }

    // Get total count
    const total = await prisma.service.count({ where })

    // Get services
    const services = await prisma.service.findMany({
      where,
      include: {
        campus: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            attendances: true,
            offerings: true
          }
        }
      },
      orderBy: {
        [filters.sortBy]: filters.sortOrder
      },
      skip: pagination.skip,
      take: pagination.limit
    })

    const response = createPaginatedResponse(services, total, pagination)
    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}, ['attendance:read'])

// POST /api/services - Create new service
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const data = validateBody(createServiceSchema, body)
    
    const service = await prisma.service.create({
      data: {
        ...data,
        date: new Date(data.date),
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        createdBy: user.id
      },
      include: {
        campus: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['attendance:write'])

