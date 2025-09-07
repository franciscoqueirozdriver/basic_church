import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, validateBody, handleApiError } from '@/utils/api'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

const checkinSchema = z.object({
  personId: z.string().cuid('ID da pessoa inválido'),
  status: z.enum(['PRESENTE', 'AUSENTE', 'JUSTIFICADO']).default('PRESENTE'),
  notes: z.string().optional()
})

const bulkCheckinSchema = z.object({
  attendances: z.array(z.object({
    personId: z.string().cuid(),
    status: z.enum(['PRESENTE', 'AUSENTE', 'JUSTIFICADO']).default('PRESENTE'),
    notes: z.string().optional()
  }))
})

// POST /api/services/[id]/checkin - Quick check-in for a service
export const POST = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    
    // Check if it's bulk check-in or single check-in
    if (body.attendances) {
      // Bulk check-in
      const data = validateBody(bulkCheckinSchema, body)
      
      const service = await prisma.service.findUnique({
        where: { id: params.id }
      })
      
      if (!service) {
        return NextResponse.json(
          { error: 'Serviço não encontrado' },
          { status: 404 }
        )
      }

      // Create or update attendances
      const results = await Promise.all(
        data.attendances.map(async (attendance) => {
          return prisma.attendance.upsert({
            where: {
              personId_serviceId: {
                personId: attendance.personId,
                serviceId: params.id
              }
            },
            update: {
              status: attendance.status,
              notes: attendance.notes,
              updatedBy: user.id
            },
            create: {
              personId: attendance.personId,
              serviceId: params.id,
              status: attendance.status,
              notes: attendance.notes,
              createdBy: user.id
            },
            include: {
              person: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  fullName: true
                }
              }
            }
          })
        })
      )

      return NextResponse.json({
        message: `${results.length} presenças registradas com sucesso`,
        attendances: results
      })
    } else {
      // Single check-in
      const data = validateBody(checkinSchema, body)
      
      const service = await prisma.service.findUnique({
        where: { id: params.id }
      })
      
      if (!service) {
        return NextResponse.json(
          { error: 'Serviço não encontrado' },
          { status: 404 }
        )
      }

      const person = await prisma.person.findUnique({
        where: { id: data.personId }
      })
      
      if (!person) {
        return NextResponse.json(
          { error: 'Pessoa não encontrada' },
          { status: 404 }
        )
      }

      const attendance = await prisma.attendance.upsert({
        where: {
          personId_serviceId: {
            personId: data.personId,
            serviceId: params.id
          }
        },
        update: {
          status: data.status,
          notes: data.notes,
          updatedBy: user.id
        },
        create: {
          personId: data.personId,
          serviceId: params.id,
          status: data.status,
          notes: data.notes,
          createdBy: user.id
        },
        include: {
          person: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fullName: true
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              date: true
            }
          }
        }
      })

      return NextResponse.json(attendance)
    }
  } catch (error) {
    return handleApiError(error)
  }
}, ['attendance:write'])

// GET /api/services/[id]/checkin - Get attendance list for a service
export const GET = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        attendances: {
          include: {
            person: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                fullName: true,
                photo: true
              }
            }
          },
          orderBy: {
            person: {
              fullName: 'asc'
            }
          }
        }
      }
    })
    
    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }

    let attendances = service.attendances

    // Filter by search if provided
    if (search) {
      attendances = attendances.filter(attendance =>
        attendance.person.fullName.toLowerCase().includes(search.toLowerCase()) ||
        attendance.person.firstName.toLowerCase().includes(search.toLowerCase()) ||
        attendance.person.lastName.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      service: {
        id: service.id,
        name: service.name,
        date: service.date,
        type: service.type
      },
      attendances,
      summary: {
        total: service.attendances.length,
        present: service.attendances.filter(a => a.status === 'PRESENTE').length,
        absent: service.attendances.filter(a => a.status === 'AUSENTE').length,
        justified: service.attendances.filter(a => a.status === 'JUSTIFICADO').length
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['attendance:read'])

