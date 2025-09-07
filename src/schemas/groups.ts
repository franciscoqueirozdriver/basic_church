import { z } from 'zod'
import { GroupType, AttendanceStatus } from '@prisma/client'

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  description: z.string().optional(),
  type: z.nativeEnum(GroupType),
  capacity: z.number().min(1).optional(),
  location: z.string().optional(),
  meetingDay: z.number().min(0).max(6).optional(), // 0-6 (Sunday-Saturday)
  meetingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)').optional(),
  leaderId: z.string().cuid().optional(),
  campusId: z.string().cuid().optional()
})

export const updateGroupSchema = createGroupSchema.partial()

export const groupFilterSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(GroupType).optional(),
  leaderId: z.string().cuid().optional(),
  campusId: z.string().cuid().optional(),
  meetingDay: z.number().min(0).max(6).optional(),
  isActive: z.boolean().optional(),
  hasCapacity: z.boolean().optional(),
  sortBy: z.enum(['name', 'type', 'meetingDay', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export const joinGroupSchema = z.object({
  personId: z.string().cuid('ID da pessoa inválido')
})

export const groupAttendanceSchema = z.object({
  personId: z.string().cuid('ID da pessoa inválido'),
  date: z.string().datetime('Data inválida'),
  status: z.nativeEnum(AttendanceStatus).default('PRESENTE'),
  notes: z.string().optional()
})

export const bulkGroupAttendanceSchema = z.object({
  date: z.string().datetime('Data inválida'),
  attendances: z.array(z.object({
    personId: z.string().cuid(),
    status: z.nativeEnum(AttendanceStatus).default('PRESENTE'),
    notes: z.string().optional()
  }))
})

export type CreateGroupData = z.infer<typeof createGroupSchema>
export type UpdateGroupData = z.infer<typeof updateGroupSchema>
export type GroupFilters = z.infer<typeof groupFilterSchema>
export type JoinGroupData = z.infer<typeof joinGroupSchema>
export type GroupAttendanceData = z.infer<typeof groupAttendanceSchema>
export type BulkGroupAttendanceData = z.infer<typeof bulkGroupAttendanceSchema>

