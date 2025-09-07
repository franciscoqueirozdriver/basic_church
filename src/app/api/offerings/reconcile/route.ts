import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleApiError } from '@/utils/api'
import { PixProvider } from '@/utils/pix'

// POST /api/offerings/reconcile - Daily PIX reconciliation
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    // Get all pending PIX payments from last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const pendingPayments = await prisma.offering.findMany({
      where: {
        method: 'PIX',
        pixStatus: 'PENDING',
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    const reconciliationResults = []
    let updatedCount = 0

    // Check status of each pending payment
    for (const payment of pendingPayments) {
      if (!payment.pixTxId) continue

      try {
        const status = await PixProvider.checkPaymentStatus(payment.pixTxId)
        
        if (status.status !== 'PENDING') {
          // Update payment status
          await prisma.offering.update({
            where: { id: payment.id },
            data: {
              pixStatus: status.status,
              updatedAt: new Date()
            }
          })

          // Create audit log
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'UPDATE',
              table: 'offerings',
              recordId: payment.id,
              oldData: { pixStatus: payment.pixStatus },
              newData: { pixStatus: status.status }
            }
          })

          reconciliationResults.push({
            offeringId: payment.id,
            txId: payment.pixTxId,
            oldStatus: payment.pixStatus,
            newStatus: status.status,
            amount: payment.amount
          })

          updatedCount++
        }
      } catch (error) {
        console.error(`Error checking PIX status for ${payment.pixTxId}:`, error)
        reconciliationResults.push({
          offeringId: payment.id,
          txId: payment.pixTxId,
          error: 'Failed to check status'
        })
      }
    }

    // Generate reconciliation report
    const report = {
      date: new Date(),
      totalChecked: pendingPayments.length,
      totalUpdated: updatedCount,
      results: reconciliationResults,
      summary: {
        paid: reconciliationResults.filter(r => r.newStatus === 'PAID').length,
        expired: reconciliationResults.filter(r => r.newStatus === 'EXPIRED').length,
        cancelled: reconciliationResults.filter(r => r.newStatus === 'CANCELLED').length,
        errors: reconciliationResults.filter(r => r.error).length
      }
    }

    return NextResponse.json({
      message: `Reconciliation completed. ${updatedCount} payments updated.`,
      report
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:write'])

// GET /api/offerings/reconcile - Get reconciliation history
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Get audit logs for PIX reconciliation
    const where: any = {
      table: 'offerings',
      action: 'UPDATE',
      newData: {
        path: ['pixStatus'],
        not: 'PENDING'
      }
    }

    if (dateFrom) {
      where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) }
    }

    if (dateTo) {
      where.createdAt = { ...where.createdAt, lte: new Date(dateTo) }
    }

    const reconciliationLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
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
      take: 100
    })

    return NextResponse.json({
      logs: reconciliationLogs,
      summary: {
        total: reconciliationLogs.length,
        lastReconciliation: reconciliationLogs[0]?.createdAt || null
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['offerings:read'])

