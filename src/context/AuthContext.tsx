import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import authService from '../services/authService'
import { getLandingRoute, hasPermission as checkPermission } from '../auth/auth'
import type { AuthUser, Permission } from '../auth/auth'

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  isAuthenticated: boolean
  hasPermission: (permission: Permission, options?: { communityId?: string; eventId?: string }) => boolean
  getDefaultLandingRoute: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    // Load user from localStorage after component mounts
    try {
      const storedUser = authService.loadUser()
      if (storedUser) {
        setUser(storedUser)
      }
    } catch (error) {
      // Silently handle localStorage access errors
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.user)
    return response.user
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const loginWithGoogle = async () => {
    throw new Error('Google Sign-In is not supported in mock mode.')
  }

  const hasPermission = (permission: Permission, options?: { communityId?: string; eventId?: string }) => {
    if (!user) return false
    return checkPermission(user.permissions, permission, options)
  }

  const getDefaultLandingRoute = () => {
    if (!user) return '/login'
    const route = getLandingRoute(user)
    console.log('🎯 Landing Route Debug:', {
      user: {
        userId: user.userId,
        permissions: user.permissions,
      },
      route
    })
    return route
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loginWithGoogle, isAuthenticated: !!user, hasPermission, getDefaultLandingRoute }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
