import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withAuth, 
  getPaginationParams, 
  createPaginatedResponse, 
  validateBody, 
  handleApiError 
} from '@/utils/api'
import { createGroupSchema, groupFilterSchema } from '@/schemas/groups'

// GET /api/groups - List groups with filters and pagination
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const pagination = getPaginationParams(request)
    
    // Parse filters
    const filters = groupFilterSchema.parse({
      search: searchParams.get('search'),
      type: searchParams.get('type'),
      leaderId: searchParams.get('leaderId'),
      campusId: searchParams.get('campusId'),
      meetingDay: searchParams.get('meetingDay') ? parseInt(searchParams.get('meetingDay')!) : undefined,
      isActive: searchParams.get('isActive') === 'true',
      hasCapacity: searchParams.get('hasCapacity') === 'true',
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: searchParams.get('sortOrder') || 'asc'
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
    if (filters.leaderId) where.leaderId = filters.leaderId
    if (filters.campusId) where.campusId = filters.campusId
    if (filters.meetingDay !== undefined) where.meetingDay = filters.meetingDay
    if (filters.isActive !== undefined) where.isActive = filters.isActive
    if (filters.hasCapacity) where.capacity = { not: null }

    // Get total count
    const total = await prisma.group.count({ where })

    // Get groups
    const groups = await prisma.group.findMany({
      where,
      include: {
        leader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            photo: true
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
            members: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        [filters.sortBy]: filters.sortOrder
      },
      skip: pagination.skip,
      take: pagination.limit
    })

    const response = createPaginatedResponse(groups, total, pagination)
    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}, ['groups:read'])

// POST /api/groups - Create new group
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const data = validateBody(createGroupSchema, body)
    
    // Validate leader exists if provided
    if (data.leaderId) {
      const leader = await prisma.person.findUnique({
        where: { id: data.leaderId }
      })
      
      if (!leader) {
        return NextResponse.json(
          { error: 'Líder não encontrado' },
          { status: 400 }
        )
      }
    }
    
    const group = await prisma.group.create({
      data: {
        ...data,
        createdBy: user.id
      },
      include: {
        leader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            photo: true
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

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['groups:write'])

