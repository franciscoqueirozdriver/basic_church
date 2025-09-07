import { z } from 'zod'
import { OfferingOrigin, PaymentMethod, PixStatus } from '@prisma/client'

export const createOfferingSchema = z.object({
  date: z.string().datetime('Data inválida'),
  origin: z.nativeEnum(OfferingOrigin),
  method: z.nativeEnum(PaymentMethod),
  amount: z.number().min(1, 'Valor deve ser maior que zero'), // Amount in cents
  description: z.string().optional(),
  notes: z.string().optional(),
  serviceId: z.string().cuid().optional(),
  campusId: z.string().cuid().optional()
})

export const updateOfferingSchema = createOfferingSchema.partial()

export const offeringFilterSchema = z.object({
  search: z.string().optional(),
  origin: z.nativeEnum(OfferingOrigin).optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
  serviceId: z.string().cuid().optional(),
  campusId: z.string().cuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  amountMin: z.number().min(0).optional(),
  amountMax: z.number().min(0).optional(),
  pixStatus: z.nativeEnum(PixStatus).optional(),
  sortBy: z.enum(['date', 'amount', 'origin', 'method', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const pixOfferingSchema = z.object({
  amount: z.number().min(100, 'Valor mínimo é R$ 1,00'), // Minimum 1 real in cents
  description: z.string().min(1, 'Descrição é obrigatória'),
  origin: z.nativeEnum(OfferingOrigin).default('OFERTA'),
  campusId: z.string().cuid().optional()
})

export type CreateOfferingData = z.infer<typeof createOfferingSchema>
export type UpdateOfferingData = z.infer<typeof updateOfferingSchema>
export type OfferingFilters = z.infer<typeof offeringFilterSchema>
export type PixOfferingData = z.infer<typeof pixOfferingSchema>

