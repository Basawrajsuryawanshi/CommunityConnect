export type RoleName = 'SuperAdmin' | 'CommunityAdmin' | 'EventOrganizer' | 'Member'
export type ScopeType = 'GLOBAL' | 'COMMUNITY' | 'EVENT'

export const PERMISSIONS = {
  ADMIN_DASHBOARD_VIEW: 'admin.dashboard.view',
  USERS_VIEW: 'users.view',
  ROLES_VIEW: 'roles.view',
  PERMISSIONS_VIEW: 'permissions.view',
  COMMUNITIES_VIEW: 'communities.view',
  EVENTS_VIEW: 'events.view',
  ANNOUNCEMENTS_VIEW: 'announcements.view',
  DISCUSSIONS_VIEW: 'discussions.view',
  REPORTS_VIEW: 'reports.view',
  AUDITLOGS_VIEW: 'auditlogs.view',
  SETTINGS_VIEW: 'settings.view',
  COMMUNITY_DASHBOARD_VIEW: 'community.dashboard.view',
  COMMUNITY_MEMBERS_VIEW: 'community.members.view',
  COMMUNITY_EVENTS_VIEW: 'community.events.view',
  COMMUNITY_ANNOUNCEMENTS_MANAGE: 'community.announcements.manage',
  ORGANIZER_DASHBOARD_VIEW: 'organizer.dashboard.view',
  EVENTS_CREATE: 'events.create',
  EVENTS_UPDATE: 'events.update',
  EVENT_BOOKINGS_VIEW: 'event.bookings.view',
  DASHBOARD_VIEW: 'dashboard.view',
  BOOKINGS_VIEW: 'bookings.view',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export interface RoleAssignment {
  role: RoleName
  scopeType: ScopeType
  scopeId?: string
}

export interface PermissionGrant {
  permission: Permission
  scopeType: ScopeType
  scopeId?: string
}

export interface AuthUser {
  userId: string
  email: string
  name: string
  avatar: string
  batch: string
  jnv: string
  assignments: RoleAssignment[]
  permissions: PermissionGrant[]
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export const ROLE_SCOPE_TYPE: Record<RoleName, ScopeType> = {
  SuperAdmin: 'GLOBAL',
  CommunityAdmin: 'COMMUNITY',
  EventOrganizer: 'EVENT',
  Member: 'GLOBAL',
}

const rolePermissionSet: Record<RoleName, Permission[]> = {
  SuperAdmin: [
    PERMISSIONS.ADMIN_DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.PERMISSIONS_VIEW,
    PERMISSIONS.COMMUNITIES_VIEW,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.ANNOUNCEMENTS_VIEW,
    PERMISSIONS.DISCUSSIONS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AUDITLOGS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.BOOKINGS_VIEW,
  ],
  CommunityAdmin: [
    PERMISSIONS.COMMUNITY_DASHBOARD_VIEW,
    PERMISSIONS.COMMUNITY_MEMBERS_VIEW,
    PERMISSIONS.COMMUNITY_EVENTS_VIEW,
    PERMISSIONS.COMMUNITY_ANNOUNCEMENTS_MANAGE,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.ANNOUNCEMENTS_VIEW,
    PERMISSIONS.DISCUSSIONS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  EventOrganizer: [
    PERMISSIONS.ORGANIZER_DASHBOARD_VIEW,
    PERMISSIONS.EVENTS_CREATE,
    PERMISSIONS.EVENTS_UPDATE,
    PERMISSIONS.EVENT_BOOKINGS_VIEW,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.ANNOUNCEMENTS_VIEW,
    PERMISSIONS.DISCUSSIONS_VIEW,
    PERMISSIONS.BOOKINGS_VIEW,
  ],
  Member: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.ANNOUNCEMENTS_VIEW,
    PERMISSIONS.DISCUSSIONS_VIEW,
    PERMISSIONS.BOOKINGS_VIEW,
  ],
}

export function buildPermissionGrants(assignments: RoleAssignment[]): PermissionGrant[] {
  const grants: PermissionGrant[] = []

  for (const assignment of assignments) {
    const permissions = rolePermissionSet[assignment.role] || []
    for (const permission of permissions) {
      grants.push({
        permission,
        scopeType: assignment.scopeType,
        scopeId: assignment.scopeId,
      })
    }
  }

  return grants
}

export function getLandingRoute(user: AuthUser): string {
  const hasGlobalAdmin = user.permissions.some(
    (grant) => grant.permission === PERMISSIONS.ADMIN_DASHBOARD_VIEW && grant.scopeType === 'GLOBAL',
  )

  if (hasGlobalAdmin) {
    return '/admin/dashboard'
  }

  const communityGrant = user.permissions.find(
    (grant) => grant.permission === PERMISSIONS.COMMUNITY_DASHBOARD_VIEW && grant.scopeType === 'COMMUNITY' && grant.scopeId,
  )

  if (communityGrant) {
    return `/community/${communityGrant.scopeId}/dashboard`
  }

  const organizerGrant = user.permissions.find(
    (grant) => grant.permission === PERMISSIONS.ORGANIZER_DASHBOARD_VIEW,
  )

  if (organizerGrant) {
    return '/organizer/dashboard'
  }

  return '/dashboard'
}

export function hasPermission(
  grants: PermissionGrant[],
  permission: Permission,
  options?: { communityId?: string; eventId?: string },
): boolean {
  if (!options?.communityId && !options?.eventId) {
    return grants.some((grant) => grant.permission === permission)
  }

  const requestedScopeType: ScopeType = options?.eventId
    ? 'EVENT'
    : options?.communityId
    ? 'COMMUNITY'
    : 'GLOBAL'

  return grants.some((grant) => {
    if (grant.permission !== permission) {
      return false
    }

    if (grant.scopeType === 'GLOBAL') {
      return true
    }

    if (grant.scopeType !== requestedScopeType) {
      return false
    }

    if (requestedScopeType === 'COMMUNITY') {
      return !!options?.communityId && grant.scopeId === options.communityId
    }

    if (requestedScopeType === 'EVENT') {
      return !!options?.eventId && grant.scopeId === options.eventId
    }

    return true
  })
}
