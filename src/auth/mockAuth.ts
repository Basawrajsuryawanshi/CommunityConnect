import { buildPermissionGrants, type AuthResponse, type AuthUser, type RoleAssignment } from './auth'

const COMMUNITY_ID = 'c1'
const EVENT_ID = 'e1'

interface MockUserRecord {
  userId: string
  email: string
  password: string
  name: string
  avatar: string
  batch: string
  jnv: string
  assignments: RoleAssignment[]
}

const users: MockUserRecord[] = [
  {
    userId: 'u-superadmin',
    email: 'superadmin@communityconnect.local',
    password: 'DevPass123!',
    name: 'Super Admin',
    avatar: 'SA',
    batch: '1990',
    jnv: 'Head Office',
    assignments: [
      { role: 'SuperAdmin', scopeType: 'GLOBAL' },
    ],
  },
  {
    userId: 'u-communityadmin',
    email: 'communityadmin@communityconnect.local',
    password: 'DevPass123!',
    name: 'Community Admin',
    avatar: 'CA',
    batch: '2005',
    jnv: 'JNV Alumni',
    assignments: [
      { role: 'CommunityAdmin', scopeType: 'COMMUNITY', scopeId: COMMUNITY_ID },
    ],
  },
  {
    userId: 'u-organizer',
    email: 'organizer@communityconnect.local',
    password: 'DevPass123!',
    name: 'Event Organizer',
    avatar: 'EO',
    batch: '2010',
    jnv: 'JNV Alumni',
    assignments: [
      { role: 'EventOrganizer', scopeType: 'EVENT', scopeId: EVENT_ID },
    ],
  },
  {
    userId: 'u-member',
    email: 'member@communityconnect.local',
    password: 'DevPass123!',
    name: 'Member User',
    avatar: 'MU',
    batch: '2015',
    jnv: 'JNV Alumni',
    assignments: [
      { role: 'Member', scopeType: 'GLOBAL' },
    ],
  },
]

export function findMockUser(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export function getMockUserById(userId: string) {
  return users.find((user) => user.userId === userId)
}

export function buildAuthResponse(user: MockUserRecord): AuthResponse {
  const authUser: AuthUser = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    batch: user.batch,
    jnv: user.jnv,
    assignments: user.assignments,
    permissions: buildPermissionGrants(user.assignments),
  }

  const now = Date.now()
  const expiresAt = new Date(now + 15 * 60 * 1000).toISOString()

  return {
    user: authUser,
    accessToken: btoa(`${user.userId}:${now}`),
    refreshToken: crypto.randomUUID(),
    expiresAt,
  }
}

export function getAllMockUsers() {
  return users.map((user) => ({
    userId: user.userId,
    email: user.email,
    name: user.name,
  }))
}
