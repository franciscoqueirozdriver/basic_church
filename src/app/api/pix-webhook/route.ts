import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/utils/api'
import { PixWebhookData } from '@/utils/pix'

// POST /api/pix-webhook - Receive PIX payment notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PixWebhookData
    
    // Validate webhook signature in production
    // const signature = request.headers.get('x-pix-signature')
    // if (!validateWebhookSignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    // Find offering by PIX transaction ID
    const offering = await prisma.offering.findUnique({
      where: {
        pixTxId: body.txId
      }
    })

    if (!offering) {
      return NextResponse.json(
        { error: 'Offering not found' },
        { status: 404 }
      )
    }

    // Update offering status
    const updatedOffering = await prisma.offering.update({
      where: {
        id: offering.id
      },
      data: {
        pixStatus: body.status,
        updatedAt: new Date()
      }
    })

    // If payment was successful, create audit log
    if (body.status === 'PAID') {
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          table: 'offerings',
          recordId: offering.id,
          oldData: { pixStatus: offering.pixStatus },
          newData: { pixStatus: 'PAID', paidAt: body.paidAt }
        }
      })

      // Here you could also:
      // - Send confirmation email
      // - Update financial reports
      // - Trigger other business logic
    }

    return NextResponse.json({
      message: 'Webhook processed successfully',
      offeringId: updatedOffering.id,
      status: updatedOffering.pixStatus
    })
  } catch (error) {
    console.error('PIX webhook error:', error)
    return handleApiError(error)
  }
}

// GET /api/pix-webhook - Health check
export async function GET() {
  return NextResponse.json({
    message: 'PIX webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}

