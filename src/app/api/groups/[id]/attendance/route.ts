import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, getPaginationParams, createPaginatedResponse, validateBody, handleApiError } from '@/utils/api'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

const groupAttendanceSchema = z.object({
  date: z.string(),
  attendees: z.array(z.object({
    personId: z.string(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
    notes: z.string().optional()
  })),
  notes: z.string().optional(),
  topic: z.string().optional()
})

// GET /api/groups/[id]/attendance - List group attendance records
export const GET = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const pagination = getPaginationParams(request)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Check if group exists and user has access
    const group = await prisma.group.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: { personId: user.personId },
          select: { role: true }
        }
      }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Grupo não encontrado' },
        { status: 404 }
      )
    }

    // Check permissions
    const isLeader = group.members.some(m => m.role === 'LEADER')
    if (!isLeader && !user.permissions.includes('groups:read')) {
      return NextResponse.json(
        { error: 'Sem permissão para visualizar presenças' },
        { status: 403 }
      )
    }

    // Build where clause
    const where: any = {
      groupId: params.id
    }

    if (dateFrom) {
      where.date = { ...where.date, gte: new Date(dateFrom) }
    }
    if (dateTo) {
      where.date = { ...where.date, lte: new Date(dateTo) }
    }

    // Get attendance records
    const [total, attendanceRecords] = await Promise.all([
      prisma.groupAttendance.count({ where }),
      prisma.groupAttendance.findMany({
        where,
        include: {
          attendees: {
            include: {
              person: {
                select: {
                  id: true,
                  fullName: true,
                  photo: true
                }
              }
            }
          }
        },
        orderBy: {
          date: 'desc'
        },
        skip: pagination.skip,
        take: pagination.limit
      })
    ])

    // Calculate statistics
    const stats = {
      totalMeetings: total,
      averageAttendance: attendanceRecords.length > 0 
        ? attendanceRecords.reduce((sum, record) => 
            sum + record.attendees.filter(a => a.status === 'PRESENT').length, 0
          ) / attendanceRecords.length
        : 0,
      lastMeeting: attendanceRecords[0]?.date || null
    }

    const response = createPaginatedResponse(attendanceRecords, total, pagination)
    
    return NextResponse.json({
      ...response,
      stats
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['groups:read'])

// POST /api/groups/[id]/attendance - Record group attendance
export const POST = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    const data = validateBody(groupAttendanceSchema, body)

    // Check if group exists and user has permission
    const group = await prisma.group.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: { personId: user.personId },
          select: { role: true }
        }
      }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Grupo não encontrado' },
        { status: 404 }
      )
    }

    // Check permissions
    const isLeader = group.members.some(m => m.role === 'LEADER')
    if (!isLeader && !user.permissions.includes('groups:write')) {
      return NextResponse.json(
        { error: 'Sem permissão para registrar presenças' },
        { status: 403 }
      )
    }

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.groupAttendance.findFirst({
      where: {
        groupId: params.id,
        date: new Date(data.date)
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Presença já registrada para esta data' },
        { status: 400 }
      )
    }

    // Create attendance record
    const attendance = await prisma.groupAttendance.create({
      data: {
        groupId: params.id,
        date: new Date(data.date),
        notes: data.notes,
        topic: data.topic,
        createdBy: user.id,
        attendees: {
          create: data.attendees.map(attendee => ({
            personId: attendee.personId,
            status: attendee.status,
            notes: attendee.notes
          }))
        }
      },
      include: {
        attendees: {
          include: {
            person: {
              select: {
                id: true,
                fullName: true,
                photo: true
              }
            }
          }
        }
      }
    })

    // Check for members who missed 3 consecutive meetings
    await checkConsecutiveAbsences(params.id)

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['groups:write'])

// Helper function to check consecutive absences
async function checkConsecutiveAbsences(groupId: string) {
  // Get last 3 attendance records
  const recentAttendances = await prisma.groupAttendance.findMany({
    where: { groupId },
    include: {
      attendees: {
        select: {
          personId: true,
          status: true
        }
      }
    },
    orderBy: { date: 'desc' },
    take: 3
  })

  if (recentAttendances.length < 3) return

  // Get all group members
  const groupMembers = await prisma.groupMember.findMany({
    where: { groupId },
    select: { personId: true }
  })

  // Check each member for consecutive absences
  for (const member of groupMembers) {
    const memberAttendances = recentAttendances.map(attendance => 
      attendance.attendees.find(a => a.personId === member.personId)?.status || 'ABSENT'
    )

    // If all 3 recent attendances are ABSENT, create an alert
    if (memberAttendances.every(status => status === 'ABSENT')) {
      // Create notification or alert (implement notification system)
      console.log(`Alert: Member ${member.personId} has 3 consecutive absences in group ${groupId}`)
      
      // You could create a notification record here
      // await prisma.notification.create({
      //   data: {
      //     type: 'CONSECUTIVE_ABSENCE',
      //     title: 'Membro com faltas consecutivas',
      //     message: `Membro faltou aos últimos 3 encontros do grupo`,
      //     groupId,
      //     personId: member.personId
      //   }
      // })
    }
  }
}

