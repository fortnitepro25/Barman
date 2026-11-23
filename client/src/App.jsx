
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { api } from './api'
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
import Login from './pages/Login'
import Register from './pages/Register'

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [reservations, setReservations] = useState(initialReservations)
  const [menu, setMenu] = useState(initialMenu)
  const [events, setEvents] = useState(initialEvents)
  const [accent, setAccent] = useState('#a52a32')
  const [background, setBackground] = useState('#101112')

  useEffect(() => {
    api.get('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    try {
      await api.post('/auth/logout', {})
      setUser(null)
      navigate('/login')
    } catch (error) {
      alert(error.message)
    }
  }

  function handleLogin(userData) {
    setUser(userData)
    navigate('/dashboard')
  }

  if (loading) {
    return <div className="auth-loading">BARMAN / LOADING SYSTEM...</div>
  }

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

  if (!user && path !== '/login' && path !== '/register') {
    navigate('/login')
    return null
  }

  if (user && (path === '/login' || path === '/register')) {
    navigate('/dashboard')
    return null
  }

  if (path === '/login') {
    return <Login onLogin={handleLogin} />
  }

  if (path === '/register') {
    return <Register onRegister={handleLogin} />
  }

  return (
    <div className="app-shell">
      <TopBar user={user} onLogout={handleLogout} />

      <div className="app-body">
        <Sidebar
          currentPath={path}
          navigate={navigate}
          bar={user?.bar}
        />

        <main className="workspace">
          <div className="workspace-topline">
            <span>
              WORKSPACE / {path.slice(1).replaceAll('-', ' ').toUpperCase() || 'DASHBOARD'}
            </span>
            <span>OWNER ACCOUNT <i /> CONNECTED</span>
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
            <span>INTERFACE BUILD 0.2.0</span>
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
