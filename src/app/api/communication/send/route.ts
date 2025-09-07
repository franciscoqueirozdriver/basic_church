import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, validateBody, handleApiError } from '@/utils/api'
import { CommunicationService, TemplateProcessor } from '@/utils/communication'
import { z } from 'zod'

const sendCommunicationSchema = z.object({
  templateId: z.string().optional(),
  type: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']),
  subject: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  recipients: z.object({
    type: z.enum(['ALL_MEMBERS', 'GROUP', 'SEGMENT', 'CUSTOM']),
    groupId: z.string().optional(),
    segment: z.object({
      ageMin: z.number().optional(),
      ageMax: z.number().optional(),
      gender: z.enum(['MALE', 'FEMALE']).optional(),
      maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
      tags: z.array(z.string()).optional(),
      isActive: z.boolean().optional()
    }).optional(),
    customIds: z.array(z.string()).optional()
  }),
  variables: z.record(z.any()).optional(),
  scheduledFor: z.string().optional()
})

// POST /api/communication/send - Send communication
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const data = validateBody(sendCommunicationSchema, body)

    // Get template if specified
    let template = null
    if (data.templateId) {
      template = await prisma.communicationTemplate.findUnique({
        where: { id: data.templateId }
      })

      if (!template) {
        return NextResponse.json(
          { error: 'Template não encontrado' },
          { status: 404 }
        )
      }

      if (!template.isActive) {
        return NextResponse.json(
          { error: 'Template está inativo' },
          { status: 400 }
        )
      }
    }

    // Get recipients based on criteria
    const recipients = await getRecipients(data.recipients)

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum destinatário encontrado' },
        { status: 400 }
      )
    }

    // Process content with template if available
    let finalContent = data.content
    let finalSubject = data.subject

    if (template) {
      finalContent = template.content
      finalSubject = template.subject || data.subject
    }

    // Create communication log
    const communicationLog = await prisma.communicationLog.create({
      data: {
        type: data.type,
        subject: finalSubject || 'Comunicação da Igreja',
        message: finalContent,
        recipients: recipients.length,
        templateId: data.templateId,
        senderId: user.id,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : new Date(),
        status: data.scheduledFor ? 'SCHEDULED' : 'SENDING',
        variables: data.variables || {}
      }
    })

    // If scheduled, don't send now
    if (data.scheduledFor) {
      return NextResponse.json({
        message: 'Comunicação agendada com sucesso',
        communicationId: communicationLog.id,
        scheduledFor: data.scheduledFor,
        recipients: recipients.length
      }, { status: 201 })
    }

    // Send messages
    const communicationService = new CommunicationService()
    const messages = recipients.map(recipient => {
      // Process template variables for each recipient
      const personalizedVariables = {
        ...data.variables,
        nome: recipient.fullName,
        email: recipient.email,
        telefone: recipient.phone,
        igreja: process.env.APP_NAME || 'Nossa Igreja'
      }

      const processedContent = TemplateProcessor.processTemplate(finalContent, personalizedVariables)
      const processedSubject = finalSubject ? TemplateProcessor.processTemplate(finalSubject, personalizedVariables) : undefined

      return {
        to: data.type === 'EMAIL' || data.type === 'BOTH' ? recipient.email : recipient.phone,
        subject: processedSubject,
        content: processedContent,
        variables: personalizedVariables,
        templateId: data.templateId
      }
    }).filter(msg => msg.to) // Filter out recipients without contact info

    const sendResults = await communicationService.sendBulkMessages(data.type, messages)

    // Update communication log with results
    await prisma.communicationLog.update({
      where: { id: communicationLog.id },
      data: {
        status: sendResults.failed === 0 ? 'SENT' : sendResults.sent > 0 ? 'PARTIAL' : 'FAILED',
        sentCount: sendResults.sent,
        failedCount: sendResults.failed,
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      message: `Comunicação enviada: ${sendResults.sent} sucessos, ${sendResults.failed} falhas`,
      communicationId: communicationLog.id,
      results: {
        sent: sendResults.sent,
        failed: sendResults.failed,
        total: recipients.length
      }
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:write'])

// Helper function to get recipients based on criteria
async function getRecipients(criteria: any) {
  let where: any = {}

  switch (criteria.type) {
    case 'ALL_MEMBERS':
      where = { isActive: true }
      break

    case 'GROUP':
      if (!criteria.groupId) {
        throw new Error('Group ID é obrigatório para tipo GROUP')
      }
      return await prisma.person.findMany({
        where: {
          groupMembers: {
            some: {
              groupId: criteria.groupId
            }
          },
          isActive: true
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true
        }
      })

    case 'SEGMENT':
      if (criteria.segment) {
        const segment = criteria.segment
        
        if (segment.ageMin || segment.ageMax) {
          const today = new Date()
          if (segment.ageMax) {
            const minBirthDate = new Date(today.getFullYear() - segment.ageMax - 1, today.getMonth(), today.getDate())
            where.birthDate = { ...where.birthDate, gte: minBirthDate }
          }
          if (segment.ageMin) {
            const maxBirthDate = new Date(today.getFullYear() - segment.ageMin, today.getMonth(), today.getDate())
            where.birthDate = { ...where.birthDate, lte: maxBirthDate }
          }
        }

        if (segment.gender) where.gender = segment.gender
        if (segment.maritalStatus) where.maritalStatus = segment.maritalStatus
        if (segment.isActive !== undefined) where.isActive = segment.isActive

        if (segment.tags && segment.tags.length > 0) {
          where.tags = {
            hasSome: segment.tags
          }
        }
      }
      break

    case 'CUSTOM':
      if (!criteria.customIds || criteria.customIds.length === 0) {
        throw new Error('IDs customizados são obrigatórios para tipo CUSTOM')
      }
      where = {
        id: { in: criteria.customIds },
        isActive: true
      }
      break

    default:
      throw new Error('Tipo de destinatário inválido')
  }

  return await prisma.person.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true
    }
  })
}

