import { findMockUser, buildAuthResponse } from '../auth/mockAuth'
import type { AuthResponse, AuthUser } from '../auth/auth'

const LOCAL_USER_KEY = 'cc_auth_user'
const LOCAL_ACCESS_TOKEN = 'cc_access_token'
const LOCAL_REFRESH_TOKEN = 'cc_refresh_token'
const LOCAL_TOKEN_EXPIRES = 'cc_access_token_expires_at'

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const userRecord = findMockUser(email)
    if (!userRecord) {
      throw new Error('Invalid email or password.')
    }

    if (userRecord.password !== password) {
      throw new Error('Invalid email or password.')
    }

    const authResponse = buildAuthResponse(userRecord)
    this.persistAuthResponse(authResponse)
    return authResponse
  }

  async register(_email: string, _password: string): Promise<AuthResponse> {
    throw new Error('Registration is not available in mock mode.')
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
    const payload = localStorage.getItem(LOCAL_USER_KEY)
    if (!payload) return null

    try {
      return JSON.parse(payload) as AuthUser
    } catch {
      return null
    }
  }

  persistAuthResponse(response: AuthResponse): void {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(response.user))
    localStorage.setItem(LOCAL_ACCESS_TOKEN, response.accessToken)
    localStorage.setItem(LOCAL_REFRESH_TOKEN, response.refreshToken)
    localStorage.setItem(LOCAL_TOKEN_EXPIRES, response.expiresAt)
  }

  clearAuthStorage(): void {
    localStorage.removeItem(LOCAL_USER_KEY)
    localStorage.removeItem(LOCAL_ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_REFRESH_TOKEN)
    localStorage.removeItem(LOCAL_TOKEN_EXPIRES)
  }

  getAccessToken(): string | null {
    return localStorage.getItem(LOCAL_ACCESS_TOKEN)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(LOCAL_REFRESH_TOKEN)
  }

  getTokenExpiresAt(): string | null {
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
export type { AuthResponse, AuthUser }
