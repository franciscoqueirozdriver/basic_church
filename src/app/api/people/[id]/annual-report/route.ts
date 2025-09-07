import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleApiError } from '@/utils/api'
import { generateAnnualReportPDF } from '@/utils/pdf'

interface RouteParams {
  params: { id: string }
}

// GET /api/people/[id]/annual-report - Generate annual donation report
export const GET = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    // Find the person
    const person = await prisma.person.findUnique({
      where: { id: params.id },
      select: {
        fullName: true,
        email: true,
        phone: true
      }
    })

    if (!person) {
      return NextResponse.json(
        { error: 'Pessoa não encontrada' },
        { status: 404 }
      )
    }

    // Get donations for the year
    const startDate = new Date(year, 0, 1) // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59) // December 31st

    const donations = await prisma.donation.findMany({
      where: {
        personId: params.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    if (donations.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma doação encontrada para este período' },
        { status: 404 }
      )
    }

    // Prepare report data
    const reportData = {
      year,
      person: {
        fullName: person.fullName,
        email: person.email || undefined,
        phone: person.phone || undefined,
        cpf: undefined // Add CPF field to person model if needed
      },
      donations: donations.map(donation => ({
        date: donation.date,
        amount: donation.amount,
        method: donation.method,
        description: donation.description || 'Doação',
        receiptNumber: donation.receiptNumber || undefined
      })),
      church: {
        name: process.env.APP_NAME || 'Igreja Exemplo',
        address: 'Rua da Igreja, 123 - Centro',
        phone: '(11) 1234-5678',
        cnpj: '12.345.678/0001-90'
      }
    }

    // Generate PDF
    const pdf = generateAnnualReportPDF(reportData)
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio_anual_${year}_${person.fullName.replace(/\s+/g, '_')}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

// POST /api/people/[id]/annual-report - Generate custom report
export const POST = withAuth(async (request: NextRequest, user: any, { params }: RouteParams) => {
  try {
    const body = await request.json()
    const { startDate, endDate, includeDetails = true } = body

    // Find the person
    const person = await prisma.person.findUnique({
      where: { id: params.id },
      select: {
        fullName: true,
        email: true,
        phone: true
      }
    })

    if (!person) {
      return NextResponse.json(
        { error: 'Pessoa não encontrada' },
        { status: 404 }
      )
    }

    // Get donations for the period
    const donations = await prisma.donation.findMany({
      where: {
        personId: params.id,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        offering: {
          select: {
            description: true,
            origin: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Calculate summary
    const summary = {
      totalDonations: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
      averageAmount: donations.length > 0 ? donations.reduce((sum, d) => sum + d.amount, 0) / donations.length : 0,
      byMethod: donations.reduce((acc, d) => {
        acc[d.method] = (acc[d.method] || 0) + d.amount
        return acc
      }, {} as Record<string, number>),
      byOrigin: donations.reduce((acc, d) => {
        const origin = d.offering?.origin || 'OFERTA'
        acc[origin] = (acc[origin] || 0) + d.amount
        return acc
      }, {} as Record<string, number>)
    }

    if (includeDetails) {
      // Return detailed JSON report
      return NextResponse.json({
        person: {
          id: params.id,
          fullName: person.fullName,
          email: person.email,
          phone: person.phone
        },
        period: {
          startDate,
          endDate
        },
        summary,
        donations: donations.map(d => ({
          id: d.id,
          date: d.date,
          amount: d.amount,
          method: d.method,
          description: d.description,
          receiptNumber: d.receiptNumber,
          offering: d.offering
        }))
      })
    } else {
      // Return summary only
      return NextResponse.json({
        person: {
          id: params.id,
          fullName: person.fullName
        },
        period: {
          startDate,
          endDate
        },
        summary
      })
    }
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

