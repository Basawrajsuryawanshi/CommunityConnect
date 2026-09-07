import authService from './authService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://communityconnectapi-dev.eba-qdb3dqik.ap-south-1.elasticbeanstalk.com'

interface UserProfile {
  userId: string
  emailID: string
  fullName: string
  mobileNumber?: string
  schoolName?: string
  state?: string
  schoolRegion?: string
  passoutYear?: number
  role?: string
  university?: string
  currentState?: string
  currentDistrict?: string
  bloodGroup?: string
  profilePicture?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

interface BackendUserProfile {
  id: number
  fullName: string
  emailID: string
  mobileNumber?: string
  schoolName?: string
  state?: string
  schoolRegion?: string
  passoutYear?: number
  role?: string
  university?: string
  currentState?: string
  currentDistrict?: string
  bloodGroup?: string
  createdAt?: string
  updatedAt?: string
}

interface UsersResponse {
  profiles: BackendUserProfile[]
  pagination: {
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

class UsersService {
  /**
   * Get all user profiles or filter by role with pagination
   * @param role - Optional role filter ('Admin', 'Member', etc.)
   * @param pageNumber - Page number (default: 1)
   * @param pageSize - Page size (default: 50)
   * @returns Array of user profiles with pagination info
   */
  async getUserProfiles(role?: string, pageNumber: number = 1, pageSize: number = 50): Promise<UserProfile[]> {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available')
      }

      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      })

      if (role) {
        params.append('role', role)
      }

      const url = `${API_BASE_URL}/api/Users/profiles?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user profiles: ${response.statusText}`)
      }

      const data: UsersResponse = await response.json()

      // Transform backend response to frontend format
      return data.profiles.map(profile => ({
        userId: profile.id.toString(),
        emailID: profile.emailID,
        fullName: profile.fullName,
        mobileNumber: profile.mobileNumber,
        schoolName: profile.schoolName,
        state: profile.state,
        schoolRegion: profile.schoolRegion,
        passoutYear: profile.passoutYear,
        role: profile.role,
        university: profile.university,
        currentState: profile.currentState,
        currentDistrict: profile.currentDistrict,
        bloodGroup: profile.bloodGroup,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      }))
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An error occurred while fetching user profiles')
    }
  }

  /**
   * Get all user profiles with pagination info
   * @param role - Optional role filter
   * @param pageNumber - Page number (default: 1)
   * @param pageSize - Page size (default: 50)
   * @returns Object with profiles array and pagination info
   */
  async getUserProfilesWithPagination(role?: string, pageNumber: number = 1, pageSize: number = 50): Promise<{ profiles: UserProfile[], pagination: UsersResponse['pagination'] }> {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available')
      }

      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      })

      if (role) {
        params.append('role', role)
      }

      const url = `${API_BASE_URL}/api/Users/profiles?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user profiles: ${response.statusText}`)
      }

      const data: UsersResponse = await response.json()

      // Transform backend response to frontend format
      return {
        profiles: data.profiles.map(profile => ({
          userId: profile.id.toString(),
          emailID: profile.emailID,
          fullName: profile.fullName,
          mobileNumber: profile.mobileNumber,
          schoolName: profile.schoolName,
          state: profile.state,
          schoolRegion: profile.schoolRegion,
          passoutYear: profile.passoutYear,
          role: profile.role,
          university: profile.university,
          currentState: profile.currentState,
          currentDistrict: profile.currentDistrict,
          bloodGroup: profile.bloodGroup,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        })),
        pagination: data.pagination
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An error occurred while fetching user profiles')
    }
  }

  /**
   * Get a specific user profile by ID
   * @param userId - The user ID (can be string or number)
   * @returns User profile data
   */
  async getUserProfileById(userId: string | number): Promise<UserProfile> {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available')
      }

      const response = await fetch(`${API_BASE_URL}/api/Users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`)
      }

      const data: BackendUserProfile = await response.json()

      // Transform backend response to frontend format
      return {
        userId: data.id.toString(),
        emailID: data.emailID,
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        schoolName: data.schoolName,
        state: data.state,
        schoolRegion: data.schoolRegion,
        passoutYear: data.passoutYear,
        role: data.role,
        university: data.university,
        currentState: data.currentState,
        currentDistrict: data.currentDistrict,
        bloodGroup: data.bloodGroup,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An error occurred while fetching user profile')
    }
  }

  /**
   * Update user profile
   * @param userId - The user ID (can be string or number)
   * @param profileData - Updated profile data
   * @returns Updated user profile
   */
  async updateUserProfile(userId: string | number, profileData: Partial<Omit<UserProfile, 'userId'>>): Promise<UserProfile> {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available')
      }

      const response = await fetch(`${API_BASE_URL}/api/Users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update user profile: ${response.statusText}`)
      }

      const data: BackendUserProfile = await response.json()

      // Transform backend response to frontend format
      return {
        userId: data.id.toString(),
        emailID: data.emailID,
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        schoolName: data.schoolName,
        state: data.state,
        schoolRegion: data.schoolRegion,
        passoutYear: data.passoutYear,
        role: data.role,
        university: data.university,
        currentState: data.currentState,
        currentDistrict: data.currentDistrict,
        bloodGroup: data.bloodGroup,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An error occurred while updating user profile')
    }
  }
}

const usersService = new UsersService()
export default usersService
export type { UserProfile }
