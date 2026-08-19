import authService from './authService'
import type { AdminRole } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://communityconnectapi-dev.eba-qdb3dqik.ap-south-1.elasticbeanstalk.com'

// Backend API response types
interface BackendRoleDto {
  id: number
  name: string
  description: string
}

interface CreateRoleRequest {
  name: string
  description: string
}

interface UpdateRoleRequest {
  name: string
  description: string
}

class RoleService {
  /**
   * Transform backend role DTO to frontend AdminRole
   */
  private transformBackendToFrontend(backendRole: BackendRoleDto): AdminRole {
    return {
      id: `r-${backendRole.id}`,
      name: backendRole.name,
      description: backendRole.description,
    }
  }

  /**
   * Extract numeric ID from frontend role ID (e.g., "r-1" -> 1)
   */
  private extractNumericId(roleId: string): number {
    const match = roleId.match(/r-(\d+)/)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
    // If it's already a number string, parse it
    const parsed = parseInt(roleId, 10)
    if (!isNaN(parsed)) {
      return parsed
    }
    throw new Error(`Invalid role ID format: ${roleId}`)
  }

  /**
   * Get all roles
   * @returns Array of all available roles
   */
  async getAllRoles(): Promise<AdminRole[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch roles: ${response.statusText}`)
      }

      const data: BackendRoleDto[] = await response.json()
      return data.map(role => this.transformBackendToFrontend(role))
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  }

  /**
   * Get a role by ID
   * @param roleId - Role ID (can be frontend format "r-1" or backend format "1")
   * @returns Role details
   */
  async getRoleById(roleId: string | number): Promise<AdminRole> {
    try {
      const numericId = typeof roleId === 'number' ? roleId : this.extractNumericId(roleId)

      const response = await fetch(`${API_BASE_URL}/api/Roles/${numericId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Role with ID ${roleId} not found`)
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch role: ${response.statusText}`)
      }

      const data: BackendRoleDto = await response.json()
      return this.transformBackendToFrontend(data)
    } catch (error) {
      console.error(`Error fetching role ${roleId}:`, error)
      throw error
    }
  }

  /**
   * Create a new role
   * @param name - Role name
   * @param description - Role description
   * @returns Created role
   */
  async createRole(name: string, description: string): Promise<AdminRole> {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available. Please login.')
      }

      const request: CreateRoleRequest = {
        name,
        description,
      }

      const response = await fetch(`${API_BASE_URL}/api/Roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to create role: ${response.statusText}`)
      }

      const data: BackendRoleDto = await response.json()
      return this.transformBackendToFrontend(data)
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  }

  /**
   * Update an existing role
   * @param roleId - Role ID (can be frontend format "r-1" or backend format "1")
   * @param name - Updated role name
   * @param description - Updated role description
   * @returns Updated role
   */
  async updateRole(roleId: string | number, name: string, description: string): Promise<AdminRole> {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available. Please login.')
      }

      const numericId = typeof roleId === 'number' ? roleId : this.extractNumericId(roleId)

      const request: UpdateRoleRequest = {
        name,
        description,
      }

      const response = await fetch(`${API_BASE_URL}/api/Roles/${numericId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Role with ID ${roleId} not found`)
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update role: ${response.statusText}`)
      }

      const data: BackendRoleDto = await response.json()
      return this.transformBackendToFrontend(data)
    } catch (error) {
      console.error(`Error updating role ${roleId}:`, error)
      throw error
    }
  }

  /**
   * Delete a role
   * @param roleId - Role ID (can be frontend format "r-1" or backend format "1")
   * @returns True if deletion was successful
   */
  async deleteRole(roleId: string | number): Promise<boolean> {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available. Please login.')
      }

      const numericId = typeof roleId === 'number' ? roleId : this.extractNumericId(roleId)

      const response = await fetch(`${API_BASE_URL}/api/Roles/${numericId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Role with ID ${roleId} not found`)
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to delete role: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error(`Error deleting role ${roleId}:`, error)
      throw error
    }
  }
}

// Export a singleton instance
const roleService = new RoleService()
export default roleService
