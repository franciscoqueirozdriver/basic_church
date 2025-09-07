import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleApiError } from '@/utils/api'
import { generateCSV, offeringsCSVColumns, flattenDataForCSV } from '@/utils/csv'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// GET /api/offerings/export - Export offerings to CSV
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const origin = searchParams.get('origin')
    const method = searchParams.get('method')
    const campusId = searchParams.get('campusId')

    // Build where clause
    const where: any = {}
    
    if (dateFrom) {
      where.date = { ...where.date, gte: new Date(dateFrom) }
    }
    if (dateTo) {
      where.date = { ...where.date, lte: new Date(dateTo) }
    }
    if (origin) where.origin = origin
    if (method) where.method = method
    if (campusId) where.campusId = campusId

    // Get offerings data
    const offerings = await prisma.offering.findMany({
      where,
      include: {
        service: {
          select: {
            name: true,
            date: true,
            type: true
          }
        },
        campus: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Flatten data for CSV
    const flattenedData = flattenDataForCSV(offerings, offeringsCSVColumns)
    
    // Generate CSV
    const csv = generateCSV(flattenedData, offeringsCSVColumns)
    
    // Generate filename
    const dateRange = dateFrom && dateTo 
      ? `${format(new Date(dateFrom), 'dd-MM-yyyy', { locale: ptBR })}_${format(new Date(dateTo), 'dd-MM-yyyy', { locale: ptBR })}`
      : format(new Date(), 'dd-MM-yyyy', { locale: ptBR })
    
    const filename = `ofertas_${dateRange}.csv`

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

// POST /api/offerings/export - Generate custom export
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { 
      filters = {}, 
      columns = offeringsCSVColumns.map(col => col.key),
      format: exportFormat = 'csv'
    } = body

    // Build where clause from filters
    const where: any = {}
    
    if (filters.dateFrom) {
      where.date = { ...where.date, gte: new Date(filters.dateFrom) }
    }
    if (filters.dateTo) {
      where.date = { ...where.date, lte: new Date(filters.dateTo) }
    }
    if (filters.origin) where.origin = filters.origin
    if (filters.method) where.method = filters.method
    if (filters.campusId) where.campusId = filters.campusId
    if (filters.pixStatus) where.pixStatus = filters.pixStatus

    // Get offerings data
    const offerings = await prisma.offering.findMany({
      where,
      include: {
        service: {
          select: {
            name: true,
            date: true,
            type: true
          }
        },
        campus: {
          select: {
            name: true
          }
        },
        donations: {
          include: {
            person: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Filter columns based on request
    const selectedColumns = offeringsCSVColumns.filter(col => 
      columns.includes(col.key)
    )

    if (exportFormat === 'csv') {
      // Flatten data for CSV
      const flattenedData = flattenDataForCSV(offerings, selectedColumns)
      
      // Generate CSV
      const csv = generateCSV(flattenedData, selectedColumns)
      
      const filename = `ofertas_personalizado_${format(new Date(), 'dd-MM-yyyy_HH-mm', { locale: ptBR })}.csv`

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache'
        }
      })
    } else if (exportFormat === 'json') {
      // Return JSON format
      return NextResponse.json({
        data: offerings,
        summary: {
          total: offerings.length,
          totalAmount: offerings.reduce((sum, o) => sum + o.amount, 0),
          exportedAt: new Date(),
          filters
        }
      })
    }

    return NextResponse.json(
      { error: 'Formato de exportação não suportado' },
      { status: 400 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

