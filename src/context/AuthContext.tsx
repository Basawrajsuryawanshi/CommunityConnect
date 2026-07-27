import { createContext, useContext, useState, type ReactNode } from 'react'
import authService from '../services/authService'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  loginWithGoogle: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state
      setUser(null)
      localStorage.removeItem('user')
    }
  }

  const loginWithGoogle = async () => {
    // This function expects a Google ID token from the Google Sign-In flow
    // You'll need to integrate Google OAuth client library for this to work
    // For now, this is a placeholder that throws an error
    throw new Error('Google Sign-In integration requires Google OAuth client setup. Please implement the Google Sign-In flow and pass the idToken to authService.googleAuth(idToken)')

    // Example implementation (uncomment when you have Google OAuth setup):
    // const googleUser = await window.google.accounts.oauth2.initTokenClient({...})
    // const idToken = googleUser.credential
    // const response = await authService.googleAuth(idToken)
    // login({
    //   id: response.userId,
    //   name: response.email.split('@')[0],
    //   email: response.email,
    //   avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.email)}&background=4285F4&color=fff`
    // })
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, loginWithGoogle, isAuthenticated }}>
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
