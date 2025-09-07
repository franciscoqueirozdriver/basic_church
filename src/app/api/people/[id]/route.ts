import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, validateBody, handleApiError } from '@/utils/api'
import { updatePersonSchema } from '@/schemas/people'

interface RouteParams {
  params: { id: string }
}

// GET /api/people/[id] - Get person by ID
export const GET = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const person = await prisma.person.findUnique({
      where: { id: params.id },
      include: {
        household: {
          select: {
            id: true,
            name: true,
            members: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                fullName: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            lastLoginAt: true
          }
        },
        attendances: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                date: true,
                type: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        groupMembers: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          },
          where: {
            isActive: true
          }
        },
        donations: {
          orderBy: {
            date: 'desc'
          },
          take: 10
        },
        eventRegistrations: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                startDate: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!person) {
      return NextResponse.json(
        { error: 'Pessoa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(person)
  } catch (error) {
    return handleApiError(error)
  }
}, ['people:read'])

// PUT /api/people/[id] - Update person
export const PUT = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    const data = validateBody(updatePersonSchema, body)
    
    // Check if person exists
    const existingPerson = await prisma.person.findUnique({
      where: { id: params.id }
    })
    
    if (!existingPerson) {
      return NextResponse.json(
        { error: 'Pessoa não encontrada' },
        { status: 404 }
      )
    }
    
    // Generate full name if first or last name changed
    let updateData: any = { ...data }
    if (data.firstName || data.lastName) {
      const firstName = data.firstName || existingPerson.firstName
      const lastName = data.lastName || existingPerson.lastName
      updateData.fullName = `${firstName} ${lastName}`
    }
    
    // Convert date strings to Date objects
    if (data.birthDate) updateData.birthDate = new Date(data.birthDate)
    if (data.joinDate) updateData.joinDate = new Date(data.joinDate)
    if (data.baptismDate) updateData.baptismDate = new Date(data.baptismDate)
    if (data.membershipDate) updateData.membershipDate = new Date(data.membershipDate)
    if (data.email === '') updateData.email = null

    const person = await prisma.person.update({
      where: { id: params.id },
      data: {
        ...updateData,
        updatedBy: user.id
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

    return NextResponse.json(person)
  } catch (error) {
    return handleApiError(error)
  }
}, ['people:write'])

// DELETE /api/people/[id] - Delete person (soft delete)
export const DELETE = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const person = await prisma.person.findUnique({
      where: { id: params.id }
    })
    
    if (!person) {
      return NextResponse.json(
        { error: 'Pessoa não encontrada' },
        { status: 404 }
      )
    }

    // Soft delete - set isActive to false
    await prisma.person.update({
      where: { id: params.id },
      data: {
        isActive: false,
        updatedBy: user.id
      }
    })

    return NextResponse.json({ message: 'Pessoa removida com sucesso' })
  } catch (error) {
    return handleApiError(error)
  }
}, ['people:delete'])

