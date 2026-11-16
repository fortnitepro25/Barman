import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import { initialReservations, initialMenu, initialEvents } from './data/initialData'
import Dashboard from './pages/management/Dashboard'
import ReservationsPage from './pages/management/Reservations'
import MenuPage from './pages/management/Menu'
import EventsPage from './pages/management/Events'
import WebsiteStudio from './pages/management/WebsiteStudio'
import FloorPlan from './pages/management/FloorPlan'
import SettingsPage from './pages/management/Settings'
import PublicPreview from './pages/public/Home'

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  const [reservations, setReservations] = useState(initialReservations)
  const [menu, setMenu] = useState(initialMenu)
  const [events, setEvents] = useState(initialEvents)
  const [accent, setAccent] = useState('#a52a32')
  const [background, setBackground] = useState('#101112')

  const path = location.pathname

  if (path === '/preview') {
    return (
      <PublicPreview
        menu={menu}
        events={events}
        accent={accent}
        background={background}
        navigate={navigate}
      />
    )
  }

  return (
    <div className="app-shell">
      <TopBar />

      <div className="app-body">
        <Sidebar currentPath={path} navigate={navigate} />

        <main className="workspace">
          <div className="workspace-topline">
            <span>WORKSPACE / {path.slice(1).replaceAll('-', ' ').toUpperCase() || 'DASHBOARD'}</span>
            <span>THU 29 OCT 2026 <i /> LOCAL DEMO</span>
          </div>

          <div className="page-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    reservations={reservations}
                    menu={menu}
                    events={events}
                    navigate={navigate}
                  />
                }
              />

              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    reservations={reservations}
                    menu={menu}
                    events={events}
                    navigate={navigate}
                  />
                }
              />

              <Route
                path="/reservations"
                element={
                  <ReservationsPage
                    reservations={reservations}
                    setReservations={setReservations}
                  />
                }
              />

              <Route
                path="/menu"
                element={<MenuPage menu={menu} setMenu={setMenu} />}
              />

              <Route
                path="/events"
                element={<EventsPage events={events} setEvents={setEvents} />}
              />

              <Route
                path="/website"
                element={
                  <WebsiteStudio
                    accent={accent}
                    setAccent={setAccent}
                    background={background}
                    setBackground={setBackground}
                    navigate={navigate}
                  />
                }
              />

              <Route path="/floor-plan" element={<FloorPlan />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route
                path="*"
                element={
                  <section className="not-found">
                    <div className="eyebrow">ERROR / 404</div>
                    <h1>PAGE NOT FOUND</h1>
                    <button
                      className="button button-primary"
                      onClick={() => navigate('/dashboard')}
                    >
                      Return to dashboard
                    </button>
                  </section>
                }
              />
            </Routes>
          </div>

          <footer className="workspace-footer">
            <span>BARMAN VENUE MANAGEMENT SYSTEM</span>
            <span>INTERFACE BUILD 0.1.0</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
