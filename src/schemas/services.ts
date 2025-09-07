import { z } from 'zod'
import { ServiceType } from '@prisma/client'

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  description: z.string().optional(),
  type: z.nativeEnum(ServiceType),
  date: z.string().datetime('Data inválida'),
  startTime: z.string().datetime('Horário de início inválido'),
  endTime: z.string().datetime('Horário de fim inválido').optional(),
  location: z.string().optional(),
  capacity: z.number().min(1).optional(),
  campusId: z.string().cuid().optional()
})

export const updateServiceSchema = createServiceSchema.partial()

export const serviceFilterSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(ServiceType).optional(),
  campusId: z.string().cuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(['name', 'date', 'startTime', 'type', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type CreateServiceData = z.infer<typeof createServiceSchema>
export type UpdateServiceData = z.infer<typeof updateServiceSchema>
export type ServiceFilters = z.infer<typeof serviceFilterSchema>

