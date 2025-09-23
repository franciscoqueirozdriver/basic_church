import { Role } from '@prisma/client'

export const roleHierarchy: Record<Role, number> = {
  ADMIN: 6,
  PASTOR: 5,
  LEADER: 4,
  TREASURER: 3,
  SECRETARY: 2,
  MEMBER: 1
}

export const permissions: Record<string, Role[]> = {
  // Dashboard
  VIEW_DASHBOARD: [Role.ADMIN, Role.PASTOR, Role.LEADER, Role.TREASURER, Role.SECRETARY, Role.MEMBER],
  
  // People management
  VIEW_PEOPLE: [Role.ADMIN, Role.PASTOR, Role.LEADER, Role.SECRETARY],
  CREATE_PEOPLE: [Role.ADMIN, Role.PASTOR, Role.SECRETARY],
  EDIT_PEOPLE: [Role.ADMIN, Role.PASTOR, Role.SECRETARY],
  DELETE_PEOPLE: [Role.ADMIN, Role.PASTOR],
  
  // Services
  VIEW_SERVICES: [Role.ADMIN, Role.PASTOR, Role.LEADER, Role.SECRETARY],
  CREATE_SERVICES: [Role.ADMIN, Role.PASTOR, Role.SECRETARY],
  EDIT_SERVICES: [Role.ADMIN, Role.PASTOR, Role.SECRETARY],
  DELETE_SERVICES: [Role.ADMIN, Role.PASTOR],
  
  // Groups
  VIEW_GROUPS: [Role.ADMIN, Role.PASTOR, Role.LEADER],
  CREATE_GROUPS: [Role.ADMIN, Role.PASTOR],
  EDIT_GROUPS: [Role.ADMIN, Role.PASTOR, Role.LEADER],
  DELETE_GROUPS: [Role.ADMIN, Role.PASTOR],
  
  // Offerings
  VIEW_OFFERINGS: [Role.ADMIN, Role.PASTOR, Role.TREASURER],
  CREATE_OFFERINGS: [Role.ADMIN, Role.PASTOR, Role.TREASURER],
  EDIT_OFFERINGS: [Role.ADMIN, Role.PASTOR, Role.TREASURER],
  DELETE_OFFERINGS: [Role.ADMIN, Role.PASTOR],
  
  // Events
  VIEW_EVENTS: [Role.ADMIN, Role.PASTOR, Role.LEADER, Role.SECRETARY, Role.MEMBER],
  CREATE_EVENTS: [Role.ADMIN, Role.PASTOR, Role.SECRETARY],
  EDIT_EVENTS: [Role.ADMIN, Role.PASTOR, Role.SECRETARY],
  DELETE_EVENTS: [Role.ADMIN, Role.PASTOR],
  
  // Settings
  VIEW_SETTINGS: [Role.ADMIN, Role.PASTOR],
  EDIT_SETTINGS: [Role.ADMIN]
}

export function hasPermission(userRole: Role, permission: keyof typeof permissions): boolean {
  return permissions[permission].includes(userRole)
}

export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole]
}
