import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleApiError } from '@/utils/api'
import { format, addDays, isToday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// GET /api/groups/reminders - Get pending reminders
export const GET = withAuth(async (request: NextRequest, user: any) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'today', 'tomorrow', 'upcoming'

    let dateFilter: any = {}
    
    if (type === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      dateFilter = {
        gte: today,
        lt: tomorrow
      }
    } else if (type === 'tomorrow') {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const dayAfter = new Date(tomorrow)
      dayAfter.setDate(dayAfter.getDate() + 1)
      
      dateFilter = {
        gte: tomorrow,
        lt: dayAfter
      }
    } else {
      // Upcoming (next 7 days)
      const today = new Date()
      const nextWeek = addDays(today, 7)
      
      dateFilter = {
        gte: today,
        lte: nextWeek
      }
    }

    // Get groups with meetings today/tomorrow/upcoming
    const groups = await prisma.group.findMany({
      where: {
        isActive: true,
        OR: [
          // Groups with regular schedule
          {
            schedule: {
              not: null
            }
          },
          // Groups with specific meeting dates
          {
            meetings: {
              some: {
                date: dateFilter
              }
            }
          }
        ]
      },
      include: {
        members: {
          include: {
            person: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        meetings: {
          where: {
            date: dateFilter
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    // Process reminders
    const reminders = []
    
    for (const group of groups) {
      // Check if group has meetings scheduled
      if (group.meetings.length > 0) {
        for (const meeting of group.meetings) {
          reminders.push({
            groupId: group.id,
            groupName: group.name,
            meetingDate: meeting.date,
            meetingTime: meeting.time,
            location: group.location,
            members: group.members.map(m => ({
              id: m.person.id,
              name: m.person.fullName,
              email: m.person.email,
              phone: m.person.phone,
              role: m.role
            })),
            reminderType: isToday(meeting.date) ? 'today' : isTomorrow(meeting.date) ? 'tomorrow' : 'upcoming'
          })
        }
      } else if (group.schedule) {
        // Check regular schedule (implement schedule parsing logic)
        const scheduleInfo = parseGroupSchedule(group.schedule)
        if (scheduleInfo && shouldSendReminder(scheduleInfo, type)) {
          reminders.push({
            groupId: group.id,
            groupName: group.name,
            schedule: group.schedule,
            location: group.location,
            members: group.members.map(m => ({
              id: m.person.id,
              name: m.person.fullName,
              email: m.person.email,
              phone: m.person.phone,
              role: m.role
            })),
            reminderType: type
          })
        }
      }
    }

    return NextResponse.json({
      reminders,
      total: reminders.length,
      summary: {
        today: reminders.filter(r => r.reminderType === 'today').length,
        tomorrow: reminders.filter(r => r.reminderType === 'tomorrow').length,
        upcoming: reminders.filter(r => r.reminderType === 'upcoming').length
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['groups:read'])

// POST /api/groups/reminders - Send reminders
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { type = 'today', groupIds = [], sendEmail = true, sendWhatsApp = false } = body

    // Get reminders to send
    const remindersResponse = await fetch(`${request.nextUrl.origin}/api/groups/reminders?type=${type}`)
    const { reminders } = await remindersResponse.json()

    // Filter by specific groups if provided
    const filteredReminders = groupIds.length > 0 
      ? reminders.filter((r: any) => groupIds.includes(r.groupId))
      : reminders

    let sentCount = 0
    let failedCount = 0
    const results = []

    for (const reminder of filteredReminders) {
      try {
        // Send reminders to group members
        const sendResult = await sendGroupReminder({
          reminder,
          sendEmail,
          sendWhatsApp,
          senderName: user.person?.fullName || user.email
        })

        // Log communication
        await prisma.communicationLog.create({
          data: {
            type: sendEmail && sendWhatsApp ? 'BOTH' : sendEmail ? 'EMAIL' : 'WHATSAPP',
            subject: `Lembrete: ${reminder.groupName}`,
            message: generateReminderMessage(reminder),
            recipients: reminder.members.length,
            groupId: reminder.groupId,
            senderId: user.id,
            status: sendResult.success ? 'SENT' : 'FAILED',
            sentCount: sendResult.sentCount,
            failedCount: sendResult.failedCount,
            errorMessage: sendResult.error
          }
        })

        sentCount += sendResult.sentCount
        failedCount += sendResult.failedCount
        results.push({
          groupId: reminder.groupId,
          groupName: reminder.groupName,
          ...sendResult
        })
      } catch (error) {
        failedCount++
        results.push({
          groupId: reminder.groupId,
          groupName: reminder.groupName,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      message: `Lembretes enviados: ${sentCount} sucessos, ${failedCount} falhas`,
      sentCount,
      failedCount,
      results
    })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:write'])

// Helper functions
function parseGroupSchedule(schedule: string): any {
  // Simple schedule parsing - implement more sophisticated logic as needed
  // Example: "Terça-feira 19:30" or "Sábado 10:00"
  const scheduleRegex = /(\w+)\s+(\d{1,2}):(\d{2})/
  const match = schedule.match(scheduleRegex)
  
  if (match) {
    const [, dayName, hour, minute] = match
    return {
      dayName,
      hour: parseInt(hour),
      minute: parseInt(minute)
    }
  }
  
  return null
}

function shouldSendReminder(scheduleInfo: any, type: string): boolean {
  // Implement logic to check if reminder should be sent based on schedule
  // This is a simplified version
  const today = new Date()
  const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
  const todayName = dayNames[today.getDay()]
  
  if (type === 'today') {
    return scheduleInfo.dayName.toLowerCase() === todayName
  } else if (type === 'tomorrow') {
    const tomorrowName = dayNames[(today.getDay() + 1) % 7]
    return scheduleInfo.dayName.toLowerCase() === tomorrowName
  }
  
  return false
}

async function sendGroupReminder({
  reminder,
  sendEmail,
  sendWhatsApp,
  senderName
}: {
  reminder: any
  sendEmail: boolean
  sendWhatsApp: boolean
  senderName: string
}) {
  let sentCount = 0
  let failedCount = 0
  const errors: string[] = []

  const message = generateReminderMessage(reminder)
  const subject = `Lembrete: ${reminder.groupName}`

  for (const member of reminder.members) {
    try {
      if (sendEmail && member.email) {
        await sendEmail({
          to: member.email,
          subject,
          body: `Olá ${member.name},\n\n${message}\n\nAté lá!\n${senderName}`
        })
        sentCount++
      }

      if (sendWhatsApp && member.phone) {
        await sendWhatsApp({
          to: member.phone,
          message: `*${subject}*\n\nOlá ${member.name}!\n\n${message}\n\nAté lá! 😊\n_${senderName}_`
        })
        sentCount++
      }
    } catch (error) {
      failedCount++
      errors.push(`${member.name}: ${error}`)
    }
  }

  return {
    success: failedCount === 0,
    sentCount,
    failedCount,
    error: errors.length > 0 ? errors.join('; ') : null
  }
}

function generateReminderMessage(reminder: any): string {
  if (reminder.meetingDate) {
    const dateStr = format(new Date(reminder.meetingDate), "dd 'de' MMMM", { locale: ptBR })
    const timeStr = reminder.meetingTime || '19:30'
    return `Não esqueça do nosso encontro ${reminder.reminderType === 'today' ? 'hoje' : 'amanhã'} (${dateStr}) às ${timeStr}${reminder.location ? ` em ${reminder.location}` : ''}!`
  } else {
    return `Não esqueça do nosso encontro do grupo ${reminder.groupName} ${reminder.reminderType === 'today' ? 'hoje' : 'amanhã'}${reminder.location ? ` em ${reminder.location}` : ''}!`
  }
}

// Stub functions (same as in messages route)
async function sendEmail({ to, subject, body }: { to: string, subject: string, body: string }) {
  console.log(`Sending reminder email to ${to}: ${subject}`)
  await new Promise(resolve => setTimeout(resolve, 100))
}

async function sendWhatsApp({ to, message }: { to: string, message: string }) {
  console.log(`Sending reminder WhatsApp to ${to}: ${message}`)
  await new Promise(resolve => setTimeout(resolve, 100))
}

