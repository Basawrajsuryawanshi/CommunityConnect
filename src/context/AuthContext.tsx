import { createContext, useContext, useState, ReactNode } from 'react'

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

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const loginWithGoogle = async () => {
    // Simulate Google OAuth flow
    // In production, you would use Firebase, Auth0, or similar
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Mock Google user data
          const googleUser = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'Google User',
            email: 'user@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff'
          }

          login(googleUser)
          resolve()
        } catch (error) {
          reject(new Error('Google sign-in failed'))
        }
      }, 1500)
    })
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
