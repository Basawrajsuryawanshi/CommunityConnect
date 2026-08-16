import { findMockUser, buildAuthResponse } from '../auth/mockAuth'
import type { AuthResponse, AuthUser } from '../auth/auth'

const LOCAL_USER_KEY = 'cc_auth_user'
const LOCAL_ACCESS_TOKEN = 'cc_access_token'
const LOCAL_REFRESH_TOKEN = 'cc_refresh_token'
const LOCAL_TOKEN_EXPIRES = 'cc_access_token_expires_at'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://communityconnectapi-dev.eba-qdb3dqik.ap-south-1.elasticbeanstalk.com'

interface RegisterData {
  Email: string
  Password: string
  FullName: string
  MobileNumber: string
  SchoolName: string
  State: string
  SchoolRegion: string
  PassoutYear: number
  Role: string
  University: string
  CurrentState: string
  CurrentDistrict: string
  BloodGroup: string
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Invalid email or password')
      }

      const data = await response.json()

      // Transform backend response to match frontend AuthResponse format
      const authResponse: AuthResponse = {
        user: {
          userId: data.userId?.toString() || '',
          email: data.email || email,
          name: '', // Backend doesn't provide this on login
          avatar: '', // Backend doesn't provide this on login
          batch: '', // Backend doesn't provide this on login
          jnv: '', // Backend doesn't provide this on login
          assignments: [], // Backend doesn't provide this on login
          permissions: [] // Backend doesn't provide this on login
        },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      }

      // Persist the auth response
      if (authResponse.accessToken && authResponse.refreshToken) {
        this.persistAuthResponse(authResponse)
        return authResponse
      }

      throw new Error('Invalid response from server')
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An error occurred during login')
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Registration failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Transform backend response to match frontend AuthResponse format
      const authResponse: AuthResponse = {
        user: {
          userId: data.userId?.toString() || '',
          email: data.email || registerData.Email,
          name: registerData.FullName || '',
          avatar: '',
          batch: registerData.PassoutYear?.toString() || '',
          jnv: registerData.SchoolName || '',
          assignments: [],
          permissions: []
        },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      }

      // If the API returns an auth response, persist it
      if (authResponse.accessToken && authResponse.refreshToken) {
        this.persistAuthResponse(authResponse)
        return authResponse
      }

      // If the API doesn't return tokens, you might need to login after registration
      throw new Error('Please login with your new credentials')
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An error occurred during registration')
    }
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    this.clearAuthStorage()
    return { success: true, message: 'Logged out successfully' }
  }

  async getUserProfile(): Promise<AuthUser> {
    const user = this.loadUser()
    if (!user) {
      throw new Error('User profile is not available.')
    }
    return user
  }

  async refreshToken(refreshToken?: string): Promise<AuthResponse> {
    const token = refreshToken || this.getRefreshToken()
    if (!token) {
      throw new Error('No refresh token available')
    }

    const user = this.loadUser()
    if (!user) {
      throw new Error('No authenticated user available')
    }

    const userRecord = findMockUser(user.email)
    if (!userRecord) {
      throw new Error('Invalid refresh token')
    }

    const authResponse = buildAuthResponse(userRecord)
    this.persistAuthResponse(authResponse)
    return authResponse
  }

  loadUser(): AuthUser | null {
    // Check if we're in a browser environment with localStorage available
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null
    }

    try {
      const payload = localStorage.getItem(LOCAL_USER_KEY)
      if (!payload) return null

      return JSON.parse(payload) as AuthUser
    } catch {
      return null
    }
  }

  persistAuthResponse(response: AuthResponse): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(response.user))
    localStorage.setItem(LOCAL_ACCESS_TOKEN, response.accessToken)
    localStorage.setItem(LOCAL_REFRESH_TOKEN, response.refreshToken)
    localStorage.setItem(LOCAL_TOKEN_EXPIRES, response.expiresAt)
  }

  clearAuthStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }
    localStorage.removeItem(LOCAL_USER_KEY)
    localStorage.removeItem(LOCAL_ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_REFRESH_TOKEN)
    localStorage.removeItem(LOCAL_TOKEN_EXPIRES)
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null
    }
    return localStorage.getItem(LOCAL_ACCESS_TOKEN)
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null
    }
    return localStorage.getItem(LOCAL_REFRESH_TOKEN)
  }

  getTokenExpiresAt(): string | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null
    }
    return localStorage.getItem(LOCAL_TOKEN_EXPIRES)
  }

  isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiresAt()
    if (!expiresAt) return true
    return Date.now() >= new Date(expiresAt).getTime()
  }
}

const authService = new AuthService()
export default authService
export type { AuthResponse, AuthUser, RegisterData }
