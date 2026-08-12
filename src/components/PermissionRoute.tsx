import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Permission } from '../auth/auth'
import type { ReactNode } from 'react'

interface PermissionRouteProps {
  children: ReactNode
  permission: Permission
}

export function PermissionRoute({ children, permission }: PermissionRouteProps) {
  const { isAuthenticated, hasPermission } = useAuth()
  const params = useParams()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const communityId = params.communityId
  const eventId = params.eventId

  if (!hasPermission(permission, { communityId, eventId })) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
