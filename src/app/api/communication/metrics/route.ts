import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleApiError } from '@/utils/api'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// GET /api/communication/metrics - Get communication metrics
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '30' // days
    const type = searchParams.get('type') // EMAIL, WHATSAPP, BOTH
    const templateId = searchParams.get('templateId')

    const periodDays = parseInt(period)
    const startDate = startOfDay(subDays(new Date(), periodDays))
    const endDate = endOfDay(new Date())

    // Build where clause
    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    if (type) where.type = type
    if (templateId) where.templateId = templateId

    // Get communication logs
    const communications = await prisma.communicationLog.findMany({
      where,
      include: {
        template: {
          select: {
            name: true,
            category: true
          }
        },
        sender: {
          select: {
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
      }
    })

    // Calculate overall metrics
    const totalSent = communications.reduce((sum, c) => sum + (c.sentCount || 0), 0)
    const totalDelivered = communications.reduce((sum, c) => sum + (c.deliveredCount || 0), 0)
    const totalOpened = communications.reduce((sum, c) => sum + (c.openedCount || 0), 0)
    const totalClicked = communications.reduce((sum, c) => sum + (c.clickedCount || 0), 0)
    const totalFailed = communications.reduce((sum, c) => sum + (c.failedCount || 0), 0)

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0

    // Metrics by type
    const byType = communications.reduce((acc, c) => {
      if (!acc[c.type]) {
        acc[c.type] = {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          failed: 0
        }
      }
      acc[c.type].sent += c.sentCount || 0
      acc[c.type].delivered += c.deliveredCount || 0
      acc[c.type].opened += c.openedCount || 0
      acc[c.type].clicked += c.clickedCount || 0
      acc[c.type].failed += c.failedCount || 0
      return acc
    }, {} as Record<string, any>)

    // Metrics by template
    const byTemplate = communications.reduce((acc, c) => {
      const templateName = c.template?.name || 'Sem template'
      if (!acc[templateName]) {
        acc[templateName] = {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          failed: 0,
          category: c.template?.category || 'CUSTOM'
        }
      }
      acc[templateName].sent += c.sentCount || 0
      acc[templateName].delivered += c.deliveredCount || 0
      acc[templateName].opened += c.openedCount || 0
      acc[templateName].clicked += c.clickedCount || 0
      acc[templateName].failed += c.failedCount || 0
      return acc
    }, {} as Record<string, any>)

    // Daily metrics for chart
    const dailyMetrics = []
    for (let i = periodDays - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      const dayCommunications = communications.filter(c => 
        c.createdAt >= dayStart && c.createdAt <= dayEnd
      )

      dailyMetrics.push({
        date: format(date, 'yyyy-MM-dd'),
        dateFormatted: format(date, 'dd/MM', { locale: ptBR }),
        sent: dayCommunications.reduce((sum, c) => sum + (c.sentCount || 0), 0),
        delivered: dayCommunications.reduce((sum, c) => sum + (c.deliveredCount || 0), 0),
        opened: dayCommunications.reduce((sum, c) => sum + (c.openedCount || 0), 0),
        failed: dayCommunications.reduce((sum, c) => sum + (c.failedCount || 0), 0)
      })
    }

    // Top performing templates
    const topTemplates = Object.entries(byTemplate)
      .map(([name, metrics]: [string, any]) => ({
        name,
        ...metrics,
        deliveryRate: metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0,
        openRate: metrics.delivered > 0 ? (metrics.opened / metrics.delivered) * 100 : 0
      }))
      .sort((a, b) => b.sent - a.sent)
      .slice(0, 10)

    return NextResponse.json({
      period: {
        days: periodDays,
        startDate,
        endDate
      },
      overview: {
        totalCommunications: communications.length,
        totalSent,
        totalDelivered,
        totalOpened,
        totalClicked,
        totalFailed,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100
      },
      byType,
      byTemplate,
      dailyMetrics,
      topTemplates,
      recentCommunications: communications.slice(0, 10).map(c => ({
        id: c.id,
        subject: c.subject,
        type: c.type,
        status: c.status,
        recipients: c.recipients,
        sentCount: c.sentCount,
        deliveredCount: c.deliveredCount,
        openedCount: c.openedCount,
        failedCount: c.failedCount,
        createdAt: c.createdAt,
        template: c.template?.name,
        sender: c.sender?.person?.fullName
      }))
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:read'])

// GET /api/communication/metrics/templates - Get template performance
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { templateIds, startDate, endDate } = body

    const where: any = {
      templateId: { in: templateIds }
    }

    if (startDate) {
      where.createdAt = { ...where.createdAt, gte: new Date(startDate) }
    }
    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) }
    }

    const communications = await prisma.communicationLog.findMany({
      where,
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    // Group by template
    const templateMetrics = communications.reduce((acc, c) => {
      const templateId = c.templateId!
      if (!acc[templateId]) {
        acc[templateId] = {
          templateId,
          templateName: c.template?.name || 'Unknown',
          category: c.template?.category || 'CUSTOM',
          totalCommunications: 0,
          totalSent: 0,
          totalDelivered: 0,
          totalOpened: 0,
          totalClicked: 0,
          totalFailed: 0,
          avgDeliveryRate: 0,
          avgOpenRate: 0,
          avgClickRate: 0
        }
      }

      const metrics = acc[templateId]
      metrics.totalCommunications++
      metrics.totalSent += c.sentCount || 0
      metrics.totalDelivered += c.deliveredCount || 0
      metrics.totalOpened += c.openedCount || 0
      metrics.totalClicked += c.clickedCount || 0
      metrics.totalFailed += c.failedCount || 0

      return acc
    }, {} as Record<string, any>)

    // Calculate rates
    Object.values(templateMetrics).forEach((metrics: any) => {
      metrics.avgDeliveryRate = metrics.totalSent > 0 
        ? Math.round((metrics.totalDelivered / metrics.totalSent) * 10000) / 100
        : 0
      metrics.avgOpenRate = metrics.totalDelivered > 0 
        ? Math.round((metrics.totalOpened / metrics.totalDelivered) * 10000) / 100
        : 0
      metrics.avgClickRate = metrics.totalOpened > 0 
        ? Math.round((metrics.totalClicked / metrics.totalOpened) * 10000) / 100
        : 0
    })

    return NextResponse.json({
      templates: Object.values(templateMetrics),
      summary: {
        totalTemplates: Object.keys(templateMetrics).length,
        totalCommunications: communications.length,
        avgDeliveryRate: Object.values(templateMetrics).reduce((sum: number, t: any) => sum + t.avgDeliveryRate, 0) / Object.keys(templateMetrics).length || 0,
        avgOpenRate: Object.values(templateMetrics).reduce((sum: number, t: any) => sum + t.avgOpenRate, 0) / Object.keys(templateMetrics).length || 0
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:read'])

