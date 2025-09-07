import { z } from 'zod'
import { Gender, MaritalStatus } from '@prisma/client'

export const createPersonSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório').max(100),
  lastName: z.string().min(1, 'Sobrenome é obrigatório').max(100),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.nativeEnum(Gender).optional(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  joinDate: z.string().datetime().optional(),
  baptismDate: z.string().datetime().optional(),
  membershipDate: z.string().datetime().optional(),
  householdId: z.string().cuid().optional()
})

export const updatePersonSchema = createPersonSchema.partial()

export const personFilterSchema = z.object({
  search: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  householdId: z.string().cuid().optional(),
  isActive: z.boolean().optional(),
  hasEmail: z.boolean().optional(),
  hasPhone: z.boolean().optional(),
  ageMin: z.number().min(0).max(150).optional(),
  ageMax: z.number().min(0).max(150).optional(),
  joinDateFrom: z.string().datetime().optional(),
  joinDateTo: z.string().datetime().optional(),
  sortBy: z.enum(['firstName', 'lastName', 'fullName', 'email', 'joinDate', 'createdAt']).default('fullName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export type CreatePersonData = z.infer<typeof createPersonSchema>
export type UpdatePersonData = z.infer<typeof updatePersonSchema>
export type PersonFilters = z.infer<typeof personFilterSchema>

