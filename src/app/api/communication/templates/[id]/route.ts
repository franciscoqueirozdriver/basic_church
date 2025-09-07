import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, validateBody, handleApiError } from '@/utils/api'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

const updateTemplateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  type: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']).optional(),
  category: z.enum(['WELCOME', 'POST_SERVICE', 'MISSED_YOU', 'SCHEDULE_CONFIRMATION', 'CUSTOM']).optional(),
  subject: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório').optional(),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
})

// GET /api/communication/templates/[id] - Get template
export const GET = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const template = await prisma.communicationTemplate.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            person: {
              select: {
                fullName: true
              }
            }
          }
        },
        communications: {
          select: {
            id: true,
            createdAt: true,
            status: true,
            recipients: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            communications: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:read'])

// PUT /api/communication/templates/[id] - Update template
export const PUT = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    const data = validateBody(updateTemplateSchema, body)

    const existingTemplate = await prisma.communicationTemplate.findUnique({
      where: { id: params.id }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    const template = await prisma.communicationTemplate.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            person: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:write'])

// DELETE /api/communication/templates/[id] - Delete template
export const DELETE = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const template = await prisma.communicationTemplate.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            communications: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    // Check if template is being used
    if (template._count.communications > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir template que já foi usado. Desative-o em vez disso.' },
        { status: 400 }
      )
    }

    await prisma.communicationTemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Template excluído com sucesso'
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:write'])

// POST /api/communication/templates/[id]/duplicate - Duplicate template
export const POST = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const template = await prisma.communicationTemplate.findUnique({
      where: { id: params.id }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    const duplicatedTemplate = await prisma.communicationTemplate.create({
      data: {
        name: `${template.name} (Cópia)`,
        type: template.type,
        category: template.category,
        subject: template.subject,
        content: template.content,
        variables: template.variables,
        isActive: false, // Start as inactive
        createdById: user.id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            person: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(duplicatedTemplate, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:write'])

