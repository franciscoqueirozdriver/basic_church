import { Role } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  role: Role
  personId?: string
  person?: {
    id: string
    firstName: string
    lastName: string
    fullName: string
    photo?: string
  }
}

export interface SessionUser extends AuthUser {
  permissions: string[]
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    'users:read',
    'users:write',
    'users:delete',
    'people:read',
    'people:write',
    'people:delete',
    'attendance:read',
    'attendance:write',
    'attendance:delete',
    'offerings:read',
    'offerings:write',
    'offerings:delete',
    'groups:read',
    'groups:write',
    'groups:delete',
    'events:read',
    'events:write',
    'events:delete',
    'communication:read',
    'communication:write',
    'communication:delete',
    'reports:read',
    'audit:read',
    'settings:read',
    'settings:write'
  ],
  PASTOR: [
    'people:read',
    'people:write',
    'attendance:read',
    'attendance:write',
    'offerings:read',
    'groups:read',
    'groups:write',
    'events:read',
    'events:write',
    'communication:read',
    'communication:write',
    'reports:read'
  ],
  TESOURARIA: [
    'people:read',
    'offerings:read',
    'offerings:write',
    'offerings:delete',
    'reports:read'
  ],
  COORD_GRUPOS: [
    'people:read',
    'groups:read',
    'groups:write',
    'attendance:read',
    'attendance:write',
    'communication:read',
    'communication:write'
  ],
  RECEPCAO: [
    'people:read',
    'people:write',
    'attendance:read',
    'attendance:write',
    'events:read'
  ],
  MEMBRO: [
    'people:read'
  ]
}

export function hasPermission(userRole: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function hasAnyPermission(userRole: Role, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: Role, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

