import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withAuth, 
  getPaginationParams, 
  createPaginatedResponse, 
  validateBody, 
  handleApiError 
} from '@/utils/api'
import { createPersonSchema, personFilterSchema } from '@/schemas/people'

// GET /api/people - List people with filters and pagination
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const pagination = getPaginationParams(request)
    
    // Parse filters
    const filters = personFilterSchema.parse({
      search: searchParams.get('search'),
      gender: searchParams.get('gender'),
      maritalStatus: searchParams.get('maritalStatus'),
      city: searchParams.get('city'),
      state: searchParams.get('state'),
      householdId: searchParams.get('householdId'),
      isActive: searchParams.get('isActive') === 'true',
      hasEmail: searchParams.get('hasEmail') === 'true',
      hasPhone: searchParams.get('hasPhone') === 'true',
      ageMin: searchParams.get('ageMin') ? parseInt(searchParams.get('ageMin')!) : undefined,
      ageMax: searchParams.get('ageMax') ? parseInt(searchParams.get('ageMax')!) : undefined,
      joinDateFrom: searchParams.get('joinDateFrom'),
      joinDateTo: searchParams.get('joinDateTo'),
      sortBy: searchParams.get('sortBy') || 'fullName',
      sortOrder: searchParams.get('sortOrder') || 'asc'
    })

    // Build where clause
    const where: any = {}
    
    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    if (filters.gender) where.gender = filters.gender
    if (filters.maritalStatus) where.maritalStatus = filters.maritalStatus
    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' }
    if (filters.state) where.state = { contains: filters.state, mode: 'insensitive' }
    if (filters.householdId) where.householdId = filters.householdId
    if (filters.isActive !== undefined) where.isActive = filters.isActive
    if (filters.hasEmail) where.email = { not: null }
    if (filters.hasPhone) where.phone = { not: null }
    
    if (filters.ageMin || filters.ageMax) {
      const now = new Date()
      if (filters.ageMax) {
        const minBirthDate = new Date(now.getFullYear() - filters.ageMax - 1, now.getMonth(), now.getDate())
        where.birthDate = { ...where.birthDate, gte: minBirthDate }
      }
      if (filters.ageMin) {
        const maxBirthDate = new Date(now.getFullYear() - filters.ageMin, now.getMonth(), now.getDate())
        where.birthDate = { ...where.birthDate, lte: maxBirthDate }
      }
    }
    
    if (filters.joinDateFrom) {
      where.joinDate = { ...where.joinDate, gte: new Date(filters.joinDateFrom) }
    }
    if (filters.joinDateTo) {
      where.joinDate = { ...where.joinDate, lte: new Date(filters.joinDateTo) }
    }

    // Get total count
    const total = await prisma.person.count({ where })

    // Get people
    const people = await prisma.person.findMany({
      where,
      include: {
        household: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true
          }
        }
      },
      orderBy: {
        [filters.sortBy]: filters.sortOrder
      },
      skip: pagination.skip,
      take: pagination.limit
    })

    const response = createPaginatedResponse(people, total, pagination)
    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}, ['people:read'])

// POST /api/people - Create new person
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = validateBody(createPersonSchema, body)
    
    // Generate full name
    const fullName = `${data.firstName} ${data.lastName}`
    
    const person = await prisma.person.create({
      data: {
        ...data,
        fullName,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        joinDate: data.joinDate ? new Date(data.joinDate) : null,
        baptismDate: data.baptismDate ? new Date(data.baptismDate) : null,
        membershipDate: data.membershipDate ? new Date(data.membershipDate) : null,
        email: data.email || null
      },
      include: {
        household: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(person, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['people:write'])

