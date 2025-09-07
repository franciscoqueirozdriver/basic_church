import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, validateBody, handleApiError } from '@/utils/api'
import { joinGroupSchema } from '@/schemas/groups'

interface RouteParams {
  params: { id: string }
}

// POST /api/groups/[id]/join - Join a group
export const POST = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    const data = validateBody(joinGroupSchema, body)
    
    // Check if group exists and is active
    const group = await prisma.group.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            members: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    })
    
    if (!group || !group.isActive) {
      return NextResponse.json(
        { error: 'Grupo não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Check capacity
    if (group.capacity && group._count.members >= group.capacity) {
      return NextResponse.json(
        { error: 'Grupo já atingiu a capacidade máxima' },
        { status: 400 }
      )
    }

    // Check if person exists
    const person = await prisma.person.findUnique({
      where: { id: data.personId }
    })
    
    if (!person || !person.isActive) {
      return NextResponse.json(
        { error: 'Pessoa não encontrada ou inativa' },
        { status: 404 }
      )
    }

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_personId: {
          groupId: params.id,
          personId: data.personId
        }
      }
    })

    if (existingMember) {
      if (existingMember.isActive) {
        return NextResponse.json(
          { error: 'Pessoa já é membro deste grupo' },
          { status: 400 }
        )
      } else {
        // Reactivate membership
        const member = await prisma.groupMember.update({
          where: {
            id: existingMember.id
          },
          data: {
            isActive: true,
            joinDate: new Date(),
            updatedBy: user.id
          },
          include: {
            person: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                fullName: true,
                photo: true
              }
            },
            group: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        })

        return NextResponse.json({
          message: 'Inscrição reativada com sucesso',
          member
        })
      }
    }

    // Create new membership
    const member = await prisma.groupMember.create({
      data: {
        groupId: params.id,
        personId: data.personId,
        createdBy: user.id
      },
      include: {
        person: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            photo: true
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Inscrição realizada com sucesso',
      member
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['groups:write'])

// DELETE /api/groups/[id]/join - Leave a group
export const DELETE = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const personId = searchParams.get('personId')
    
    if (!personId) {
      return NextResponse.json(
        { error: 'ID da pessoa é obrigatório' },
        { status: 400 }
      )
    }

    // Find membership
    const member = await prisma.groupMember.findUnique({
      where: {
        groupId_personId: {
          groupId: params.id,
          personId: personId
        }
      }
    })

    if (!member || !member.isActive) {
      return NextResponse.json(
        { error: 'Pessoa não é membro deste grupo' },
        { status: 404 }
      )
    }

    // Deactivate membership
    await prisma.groupMember.update({
      where: {
        id: member.id
      },
      data: {
        isActive: false,
        updatedBy: user.id
      }
    })

    return NextResponse.json({
      message: 'Saída do grupo realizada com sucesso'
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['groups:write'])

