import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, validateBody, handleApiError } from '@/utils/api'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

const groupMessageSchema = z.object({
  subject: z.string().min(1, 'Assunto é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  type: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']),
  recipients: z.enum(['ALL', 'LEADERS', 'MEMBERS', 'CUSTOM']),
  customRecipients: z.array(z.string()).optional(),
  scheduledFor: z.string().optional()
})

// GET /api/groups/[id]/messages - List group messages
export const GET = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
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
    if (!isLeader && !user.permissions.includes('communication:read')) {
      return NextResponse.json(
        { error: 'Sem permissão para visualizar mensagens' },
        { status: 403 }
      )
    }

    // Get group messages (implement message history if needed)
    const messages = await prisma.communicationLog.findMany({
      where: {
        groupId: params.id
      },
      include: {
        sender: {
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json({
      messages,
      total: messages.length
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:read'])

// POST /api/groups/[id]/messages - Send message to group
export const POST = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    const data = validateBody(groupMessageSchema, body)

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
    if (!isLeader && !user.permissions.includes('communication:write')) {
      return NextResponse.json(
        { error: 'Sem permissão para enviar mensagens' },
        { status: 403 }
      )
    }

    // Get recipients based on selection
    let recipients: string[] = []
    
    if (data.recipients === 'ALL') {
      const allMembers = await prisma.groupMember.findMany({
        where: { groupId: params.id },
        select: { personId: true }
      })
      recipients = allMembers.map(m => m.personId)
    } else if (data.recipients === 'LEADERS') {
      const leaders = await prisma.groupMember.findMany({
        where: { 
          groupId: params.id,
          role: 'LEADER'
        },
        select: { personId: true }
      })
      recipients = leaders.map(m => m.personId)
    } else if (data.recipients === 'MEMBERS') {
      const members = await prisma.groupMember.findMany({
        where: { 
          groupId: params.id,
          role: 'MEMBER'
        },
        select: { personId: true }
      })
      recipients = members.map(m => m.personId)
    } else if (data.recipients === 'CUSTOM' && data.customRecipients) {
      recipients = data.customRecipients
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum destinatário selecionado' },
        { status: 400 }
      )
    }

    // Get recipient details
    const recipientDetails = await prisma.person.findMany({
      where: {
        id: { in: recipients }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true
      }
    })

    // Create communication log
    const communicationLog = await prisma.communicationLog.create({
      data: {
        type: data.type,
        subject: data.subject,
        message: data.message,
        recipients: recipients.length,
        groupId: params.id,
        senderId: user.id,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : new Date(),
        status: data.scheduledFor ? 'SCHEDULED' : 'SENDING'
      }
    })

    // Send messages (implement actual sending logic)
    const sendResults = await sendGroupMessages({
      type: data.type,
      subject: data.subject,
      message: data.message,
      recipients: recipientDetails,
      groupName: group.name,
      senderName: user.person?.fullName || user.email
    })

    // Update communication log with results
    await prisma.communicationLog.update({
      where: { id: communicationLog.id },
      data: {
        status: sendResults.success ? 'SENT' : 'FAILED',
        sentCount: sendResults.sentCount,
        failedCount: sendResults.failedCount,
        errorMessage: sendResults.error
      }
    })

    return NextResponse.json({
      message: 'Mensagem enviada com sucesso',
      communicationId: communicationLog.id,
      results: sendResults
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:write'])

// Helper function to send messages
async function sendGroupMessages({
  type,
  subject,
  message,
  recipients,
  groupName,
  senderName
}: {
  type: string
  subject: string
  message: string
  recipients: Array<{ id: string, fullName: string, email: string | null, phone: string | null }>
  groupName: string
  senderName: string
}) {
  let sentCount = 0
  let failedCount = 0
  const errors: string[] = []

  for (const recipient of recipients) {
    try {
      if (type === 'EMAIL' || type === 'BOTH') {
        if (recipient.email) {
          // Send email (implement with actual email provider)
          await sendEmail({
            to: recipient.email,
            subject: `[${groupName}] ${subject}`,
            body: `Olá ${recipient.fullName},\n\n${message}\n\nEnviado por: ${senderName}\nGrupo: ${groupName}`
          })
          sentCount++
        } else {
          failedCount++
          errors.push(`${recipient.fullName}: sem email`)
        }
      }

      if (type === 'WHATSAPP' || type === 'BOTH') {
        if (recipient.phone) {
          // Send WhatsApp (implement with actual WhatsApp provider)
          await sendWhatsApp({
            to: recipient.phone,
            message: `*${groupName}*\n*${subject}*\n\n${message}\n\n_Enviado por: ${senderName}_`
          })
          sentCount++
        } else {
          failedCount++
          errors.push(`${recipient.fullName}: sem telefone`)
        }
      }
    } catch (error) {
      failedCount++
      errors.push(`${recipient.fullName}: ${error}`)
    }
  }

  return {
    success: failedCount === 0,
    sentCount,
    failedCount,
    error: errors.length > 0 ? errors.join('; ') : null
  }
}

// Stub email function
async function sendEmail({ to, subject, body }: { to: string, subject: string, body: string }) {
  // Implement with actual email provider (Mailgun, SendGrid, etc.)
  console.log(`Sending email to ${to}: ${subject}`)
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
}

// Stub WhatsApp function
async function sendWhatsApp({ to, message }: { to: string, message: string }) {
  // Implement with actual WhatsApp provider
  console.log(`Sending WhatsApp to ${to}: ${message}`)
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
}

