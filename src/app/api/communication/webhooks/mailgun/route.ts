import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { WebhookHandler } from '@/utils/communication'
import crypto from 'crypto'

// POST /api/communication/webhooks/mailgun - Handle Mailgun webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature
    const signature = request.headers.get('x-mailgun-signature-256')
    const timestamp = request.headers.get('x-mailgun-timestamp')
    const token = request.headers.get('x-mailgun-token')

    if (!verifyMailgunSignature(signature, timestamp, token, JSON.stringify(body))) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Process webhook
    await WebhookHandler.handleMailgunWebhook(body)

    // Extract event data
    const eventData = body['event-data']
    if (!eventData) {
      return NextResponse.json({ message: 'No event data' })
    }

    const messageId = eventData.message?.headers?.['message-id']
    const event = eventData.event
    const timestamp_event = new Date(eventData.timestamp * 1000)
    const recipient = eventData.recipient

    // Update communication metrics
    if (messageId) {
      await updateCommunicationMetrics(messageId, event, timestamp_event, recipient)
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Mailgun webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

function verifyMailgunSignature(
  signature: string | null,
  timestamp: string | null,
  token: string | null,
  body: string
): boolean {
  if (!signature || !timestamp || !token) {
    return false
  }

  const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY
  if (!signingKey) {
    console.warn('Mailgun webhook signing key not configured')
    return true // Allow in development
  }

  const hmac = crypto.createHmac('sha256', signingKey)
  hmac.update(timestamp + token)
  const computedSignature = hmac.digest('hex')

  return signature === computedSignature
}

async function updateCommunicationMetrics(
  messageId: string,
  event: string,
  timestamp: Date,
  recipient: string
) {
  try {
    // Find communication log by message ID
    // This would require storing message IDs when sending
    const communicationLog = await prisma.communicationLog.findFirst({
      where: {
        // Add a field to store external message IDs
        // externalMessageIds: { has: messageId }
      }
    })

    if (!communicationLog) {
      console.log(`Communication log not found for message ID: ${messageId}`)
      return
    }

    // Create or update delivery status
    await prisma.communicationDelivery.upsert({
      where: {
        communicationId_recipient: {
          communicationId: communicationLog.id,
          recipient
        }
      },
      update: {
        status: mapMailgunEventToStatus(event),
        deliveredAt: event === 'delivered' ? timestamp : undefined,
        openedAt: event === 'opened' ? timestamp : undefined,
        clickedAt: event === 'clicked' ? timestamp : undefined,
        failedAt: event === 'failed' ? timestamp : undefined,
        errorMessage: event === 'failed' ? 'Delivery failed' : undefined
      },
      create: {
        communicationId: communicationLog.id,
        recipient,
        status: mapMailgunEventToStatus(event),
        deliveredAt: event === 'delivered' ? timestamp : undefined,
        openedAt: event === 'opened' ? timestamp : undefined,
        clickedAt: event === 'clicked' ? timestamp : undefined,
        failedAt: event === 'failed' ? timestamp : undefined,
        errorMessage: event === 'failed' ? 'Delivery failed' : undefined
      }
    })

    // Update communication log statistics
    await updateCommunicationStats(communicationLog.id)
  } catch (error) {
    console.error('Error updating communication metrics:', error)
  }
}

function mapMailgunEventToStatus(event: string): string {
  switch (event) {
    case 'delivered':
      return 'DELIVERED'
    case 'opened':
      return 'OPENED'
    case 'clicked':
      return 'CLICKED'
    case 'failed':
    case 'rejected':
      return 'FAILED'
    case 'complained':
      return 'COMPLAINED'
    case 'unsubscribed':
      return 'UNSUBSCRIBED'
    default:
      return 'UNKNOWN'
  }
}

async function updateCommunicationStats(communicationId: string) {
  // Aggregate delivery statistics
  const stats = await prisma.communicationDelivery.groupBy({
    by: ['status'],
    where: { communicationId },
    _count: { status: true }
  })

  const deliveredCount = stats.find(s => s.status === 'DELIVERED')?._count.status || 0
  const openedCount = stats.find(s => s.status === 'OPENED')?._count.status || 0
  const clickedCount = stats.find(s => s.status === 'CLICKED')?._count.status || 0
  const failedCount = stats.find(s => s.status === 'FAILED')?._count.status || 0

  // Update communication log with aggregated stats
  await prisma.communicationLog.update({
    where: { id: communicationId },
    data: {
      deliveredCount,
      openedCount: openedCount,
      clickedCount: clickedCount,
      failedCount
    }
  })
}

