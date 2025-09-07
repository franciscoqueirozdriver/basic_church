import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withAuth, 
  getPaginationParams, 
  createPaginatedResponse, 
  validateBody, 
  handleApiError 
} from '@/utils/api'
import { createOfferingSchema, offeringFilterSchema } from '@/schemas/offerings'

// GET /api/offerings - List offerings with filters and pagination
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const pagination = getPaginationParams(request)
    
    // Parse filters
    const filters = offeringFilterSchema.parse({
      search: searchParams.get('search'),
      origin: searchParams.get('origin'),
      method: searchParams.get('method'),
      serviceId: searchParams.get('serviceId'),
      campusId: searchParams.get('campusId'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      amountMin: searchParams.get('amountMin') ? parseInt(searchParams.get('amountMin')!) : undefined,
      amountMax: searchParams.get('amountMax') ? parseInt(searchParams.get('amountMax')!) : undefined,
      pixStatus: searchParams.get('pixStatus'),
      sortBy: searchParams.get('sortBy') || 'date',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    })

    // Build where clause
    const where: any = {}
    
    if (filters.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
        { pixTxId: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    if (filters.origin) where.origin = filters.origin
    if (filters.method) where.method = filters.method
    if (filters.serviceId) where.serviceId = filters.serviceId
    if (filters.campusId) where.campusId = filters.campusId
    if (filters.pixStatus) where.pixStatus = filters.pixStatus
    
    if (filters.dateFrom) {
      where.date = { ...where.date, gte: new Date(filters.dateFrom) }
    }
    if (filters.dateTo) {
      where.date = { ...where.date, lte: new Date(filters.dateTo) }
    }
    
    if (filters.amountMin) {
      where.amount = { ...where.amount, gte: filters.amountMin }
    }
    if (filters.amountMax) {
      where.amount = { ...where.amount, lte: filters.amountMax }
    }

    // Get total count and sum
    const [total, totalAmount] = await Promise.all([
      prisma.offering.count({ where }),
      prisma.offering.aggregate({
        where,
        _sum: {
          amount: true
        }
      })
    ])

    // Get offerings
    const offerings = await prisma.offering.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            date: true,
            type: true
          }
        },
        campus: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            donations: true
          }
        }
      },
      orderBy: {
        [filters.sortBy]: filters.sortOrder
      },
      skip: pagination.skip,
      take: pagination.limit
    })

    const response = createPaginatedResponse(offerings, total, pagination)
    
    // Add summary
    return NextResponse.json({
      ...response,
      summary: {
        totalAmount: totalAmount._sum.amount || 0,
        totalAmountFormatted: ((totalAmount._sum.amount || 0) / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

// POST /api/offerings - Create new offering
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const data = validateBody(createOfferingSchema, body)
    
    const offering = await prisma.offering.create({
      data: {
        ...data,
        date: new Date(data.date),
        createdBy: user.id
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            date: true,
            type: true
          }
        },
        campus: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(offering, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:write'])

