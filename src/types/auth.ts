import { Role } from '@prisma/client'

/**
 * Permissões disponíveis no sistema.
 * Dica: use o formato "<recurso>:<ação>".
 */
export type Permission =
  | 'users:read' | 'users:write' | 'users:delete'
  | 'people:read' | 'people:write' | 'people:delete'
  | 'attendance:read' | 'attendance:write' | 'attendance:delete'
  | 'offerings:read' | 'offerings:write' | 'offerings:delete'
  | 'groups:read' | 'groups:write' | 'groups:delete'
  | 'events:read' | 'events:write' | 'events:delete'
  | 'communication:read' | 'communication:write' | 'communication:delete'
  | 'reports:read'
  | 'audit:read'
  | 'settings:read' | 'settings:write'

/**
 * Modelo de usuário usado na sessão/autorização.
 */
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
  permissions: Permission[]
}

/**
 * Lista de permissões por função.
 * Suporta curingas:
 *  - "*" libera tudo
 *  - "recurso:*" libera todas as ações daquele recurso
 */
export const ROLE_PERMISSIONS: Record<Role, (Permission | '*'
  | `${string}:*`)[]> = {
  ADMIN: ['*'], // dá acesso total; não precisa manter lista enorme
  PASTOR: [
    'people:read', 'people:write',
    'attendance:read', 'attendance:write',
    'offerings:read',
    'groups:read', 'groups:write',
    'events:read', 'events:write',
    'communication:read', 'communication:write',
    'reports:read',
  ],
  TESOURARIA: [
    'people:read',
    'offerings:read', 'offerings:write', 'offerings:delete',
    'reports:read',
  ],
  COORD_GRUPOS: [
    'people:read',
    'groups:read', 'groups:write',
    'attendance:read', 'attendance:write',
    'communication:read', 'communication:write',
  ],
  RECEPCAO: [
    'people:read', 'people:write',
    'attendance:read', 'attendance:write',
    'events:read',
  ],
  MEMBRO: [
    'people:read',
  ],
}

/**
 * Verifica se um role possui uma permissão.
 * Regras:
 *  - "*" concede tudo
 *  - "recurso:*" concede qualquer ação para aquele recurso (ex.: "people:*")
 *  - match exato concede a permissão específica
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const grants = ROLE_PERMISSIONS[userRole] || []
  if (grants.includes('*')) return true

  const [resource] = permission.split(':') as [string, string?]
  if (grants.includes(`${resource}:*` as any)) return true

  return grants.includes(permission)
}

/** Pelo menos uma das permissões. */
export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(userRole, p))
}

/** Todas as permissões. */
export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(userRole, p))
}
