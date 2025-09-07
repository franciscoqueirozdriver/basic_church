import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, validateBody, handleApiError } from '@/utils/api'
import { pixOfferingSchema } from '@/schemas/offerings'
import { PixProvider } from '@/utils/pix'

// POST /api/offerings/pix - Generate PIX payment
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const data = validateBody(pixOfferingSchema, body)
    
    // Create PIX payment with provider
    const pixPayment = await PixProvider.createPayment(data.amount, data.description)
    
    // Create offering record
    const offering = await prisma.offering.create({
      data: {
        date: new Date(),
        origin: data.origin,
        method: 'PIX',
        amount: data.amount,
        description: data.description,
        campusId: data.campusId,
        pixTxId: pixPayment.txId,
        pixStatus: 'PENDING',
        pixQrCode: pixPayment.qrCode,
        pixCopyPaste: pixPayment.copyPaste,
        createdBy: user.id
      }
    })

    return NextResponse.json({
      offering: {
        id: offering.id,
        amount: offering.amount,
        description: offering.description,
        pixTxId: offering.pixTxId,
        pixStatus: offering.pixStatus
      },
      pix: {
        qrCode: pixPayment.qrCode,
        copyPaste: pixPayment.copyPaste,
        expiresAt: pixPayment.expiresAt
      }
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:write'])

// GET /api/offerings/pix - List PIX payments
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: any = {
      method: 'PIX'
    }

    if (status) {
      where.pixStatus = status
    }

    if (dateFrom) {
      where.date = { ...where.date, gte: new Date(dateFrom) }
    }

    if (dateTo) {
      where.date = { ...where.date, lte: new Date(dateTo) }
    }

    const pixPayments = await prisma.offering.findMany({
      where,
      select: {
        id: true,
        date: true,
        amount: true,
        description: true,
        pixTxId: true,
        pixStatus: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate summary
    const summary = {
      total: pixPayments.length,
      pending: pixPayments.filter(p => p.pixStatus === 'PENDING').length,
      paid: pixPayments.filter(p => p.pixStatus === 'PAID').length,
      expired: pixPayments.filter(p => p.pixStatus === 'EXPIRED').length,
      cancelled: pixPayments.filter(p => p.pixStatus === 'CANCELLED').length,
      totalAmount: pixPayments
        .filter(p => p.pixStatus === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0)
    }

    return NextResponse.json({
      payments: pixPayments,
      summary
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

