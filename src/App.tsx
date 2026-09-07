import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PermissionRoute } from './components/PermissionRoute'
import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { CommunityLayout } from './components/CommunityLayout'
import { OrganizerLayout } from './components/OrganizerLayout'
import { AnnouncementsPage } from './pages/AnnouncementsPage'
import { CommunityDashboardPage } from './pages/CommunityDashboardPage'
import { CommunityPage } from './pages/CommunityPage'
import { DashboardPage } from './pages/DashboardPage'
import { DiscussionsPage } from './pages/DiscussionsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventsPage } from './pages/EventsPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { MembersPage } from './pages/MembersPage'
import { TrekBookingPage } from './pages/TrekBookingPage'
import { TrekkingPage } from './pages/TrekkingPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { AdminRolesPage } from './pages/AdminRolesPage'
import { AdminPermissionsPage } from './pages/AdminPermissionsPage'
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage'
import { OrganizerCreateEventPage } from './pages/OrganizerCreateEventPage'
import { OrganizerBookingsPage } from './pages/OrganizerBookingsPage'
import { OrganizerSettingsPage } from './pages/OrganizerSettingsPage'
import { CommunitySettingsPage } from './pages/CommunitySettingsPage'
import { PERMISSIONS } from './auth/auth'
import { AdminCommunitiesPage } from './pages/AdminCommunitiesPage'
import { AdminSettingsPage } from './pages/AdminSettingsPage'

export default function App() {
  // Clear old mock data from localStorage on first load
  useEffect(() => {
    const hasCleared = sessionStorage.getItem('mock-data-cleared')
    if (!hasCleared) {
      // Clear mock data localStorage keys
      const mockDataKeys = ['cc-admin-users', 'cc-admin-roles']
      mockDataKeys.forEach(key => {
        localStorage.removeItem(key)
      })
      sessionStorage.setItem('mock-data-cleared', 'true')
      console.log('✓ Cleared mock data from localStorage')
    }
  }, [])

  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/403" element={<ForbiddenPage />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
               <Route
                path="communities"
                element={
                  <PermissionRoute permission={PERMISSIONS.COMMUNITIES_VIEW}>
                    <AdminCommunitiesPage />
                  </PermissionRoute>
                }

              />
                <Route
                path="settings"
                element={
                  <PermissionRoute permission={PERMISSIONS.SETTINGS_VIEW}>
                    <AdminSettingsPage />
                  </PermissionRoute>
                }

              />
              <Route
                path="dashboard"
                element={
                  <PermissionRoute permission={PERMISSIONS.ADMIN_DASHBOARD_VIEW}>
                    <AdminDashboardPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="users"
                element={
                  <PermissionRoute permission={PERMISSIONS.USERS_VIEW}>
                    <AdminUsersPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="roles"
                element={
                  <PermissionRoute permission={PERMISSIONS.ROLES_VIEW}>
                    <AdminRolesPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="permissions"
                element={
                  <PermissionRoute permission={PERMISSIONS.PERMISSIONS_VIEW}>
                    <AdminPermissionsPage />
                  </PermissionRoute>
                }
              />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route
              path="/community/:communityId/*"
              element={
                <ProtectedRoute>
                  <CommunityLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="dashboard"
                element={
                  <PermissionRoute permission={PERMISSIONS.COMMUNITY_DASHBOARD_VIEW}>
                    <CommunityDashboardPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="members"
                element={
                  <PermissionRoute permission={PERMISSIONS.COMMUNITY_MEMBERS_VIEW}>
                    <MembersPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="events"
                element={
                  <PermissionRoute permission={PERMISSIONS.COMMUNITY_EVENTS_VIEW}>
                    <EventsPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="announcements"
                element={
                  <PermissionRoute permission={PERMISSIONS.COMMUNITY_ANNOUNCEMENTS_MANAGE}>
                    <AnnouncementsPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <PermissionRoute permission={PERMISSIONS.SETTINGS_VIEW}>
                    <CommunitySettingsPage />
                  </PermissionRoute>
                }
              />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route
              path="/organizer/*"
              element={
                <ProtectedRoute>
                  <OrganizerLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="dashboard"
                element={
                  <PermissionRoute permission={PERMISSIONS.ORGANIZER_DASHBOARD_VIEW}>
                    <OrganizerDashboardPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="events"
                element={
                  <PermissionRoute permission={PERMISSIONS.EVENTS_VIEW}>
                    <EventsPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="events/create"
                element={
                  <PermissionRoute permission={PERMISSIONS.EVENTS_CREATE}>
                    <OrganizerCreateEventPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="bookings"
                element={
                  <PermissionRoute permission={PERMISSIONS.EVENT_BOOKINGS_VIEW}>
                    <OrganizerBookingsPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <PermissionRoute permission={PERMISSIONS.SETTINGS_VIEW}>
                    <OrganizerSettingsPage />
                  </PermissionRoute>
                }
              />
             
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>



            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/trekking" element={<TrekkingPage />} />
              <Route path="/events/trekking/:id" element={<TrekBookingPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/discussions" element={<DiscussionsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
