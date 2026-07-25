import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AppProvider } from './context/AppContext'
import { AnnouncementsPage } from './pages/AnnouncementsPage'
import { CommunityPage } from './pages/CommunityPage'
import { DashboardPage } from './pages/DashboardPage'
import { DiscussionsPage } from './pages/DiscussionsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventsPage } from './pages/EventsPage'
import { MembersPage } from './pages/MembersPage'
import { TrekBookingPage } from './pages/TrekBookingPage'
import { TrekkingPage } from './pages/TrekkingPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/trekking" element={<TrekkingPage />} />
            <Route path="events/trekking/:id" element={<TrekBookingPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="discussions" element={<DiscussionsPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
