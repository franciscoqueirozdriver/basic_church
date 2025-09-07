import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleApiError } from '@/utils/api'
import { generateReceiptPDF } from '@/utils/pdf'

interface RouteParams {
  params: { id: string }
}

// GET /api/offerings/receipt/[id] - Generate receipt PDF
export const GET = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    // Find the donation
    const donation = await prisma.donation.findUnique({
      where: { id: params.id },
      include: {
        person: {
          select: {
            fullName: true,
            email: true,
            phone: true
          }
        },
        offering: {
          select: {
            date: true,
            method: true,
            description: true
          }
        }
      }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Doação não encontrada' },
        { status: 404 }
      )
    }

    // Generate receipt number if not exists
    let receiptNumber = donation.receiptNumber
    if (!receiptNumber) {
      receiptNumber = `REC-${new Date().getFullYear()}-${donation.id.slice(-6).toUpperCase()}`
      
      // Update donation with receipt number
      await prisma.donation.update({
        where: { id: donation.id },
        data: { receiptNumber }
      })
    }

    // Prepare receipt data
    const receiptData = {
      id: donation.id,
      receiptNumber,
      date: donation.date,
      amount: donation.amount,
      method: donation.method,
      description: donation.description || donation.offering?.description || 'Doação',
      person: {
        fullName: donation.person.fullName,
        email: donation.person.email || undefined,
        phone: donation.person.phone || undefined
      },
      church: {
        name: process.env.APP_NAME || 'Igreja Exemplo',
        address: 'Rua da Igreja, 123 - Centro',
        phone: '(11) 1234-5678',
        cnpj: '12.345.678/0001-90'
      }
    }

    // Generate PDF
    const pdf = generateReceiptPDF(receiptData)
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="recibo_${receiptNumber}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

// POST /api/offerings/receipt/[id] - Update receipt info
export const POST = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    const { receiptUrl } = body

    const donation = await prisma.donation.findUnique({
      where: { id: params.id }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Doação não encontrada' },
        { status: 404 }
      )
    }

    // Update donation with receipt URL
    const updatedDonation = await prisma.donation.update({
      where: { id: params.id },
      data: {
        receiptUrl,
        updatedBy: user.id
      }
    })

    return NextResponse.json({
      message: 'Recibo atualizado com sucesso',
      donation: updatedDonation
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:write'])

