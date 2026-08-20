/**
 * Clear mock data from localStorage
 * Call this once to clean up old mock data when switching to API
 */
export function clearMockDataFromLocalStorage() {
  const mockDataKeys = [
    'cc-admin-users',
    'cc-admin-roles',
    'cc-events',
    'cc-members',
  ]

  mockDataKeys.forEach(key => {
    try {
      localStorage.removeItem(key)
      console.log(`✓ Cleared ${key} from localStorage`)
    } catch (error) {
      console.error(`Failed to clear ${key}:`, error)
    }
  })

  console.log('✓ Mock data cleanup complete')
}

/**
 * Clear specific localStorage key Testing
 */
export function clearLocalStorageKey(key: string) {
  try {
    localStorage.removeItem(key)
    console.log(`✓ Cleared ${key} from localStorage`)
  } catch (error) {
    console.error(`Failed to clear ${key}:`, error)
  }
}
