import {
  LayoutDashboard,
  CalendarDays,
  Wine,
  CalendarClock,
  PanelsTopLeft,
  Settings,
  ExternalLink,
  Armchair,
} from 'lucide-react'

const navigation = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Reservations', path: '/reservations', icon: CalendarDays },
      { label: 'Floor plan', path: '/floor-plan', icon: Armchair },
      { label: 'Menu', path: '/menu', icon: Wine },
      { label: 'Events', path: '/events', icon: CalendarClock },
    ],
  },
  {
    label: 'CONFIGURATION',
    items: [
      { label: 'Website studio', path: '/website', icon: PanelsTopLeft },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar({ currentPath, navigate }) {
  return (
    <aside className="sidebar">
      <div className="venue-card">
        <div className="venue-avatar">V</div>

        <div className="venue-info">
          <span className="eyebrow">CURRENT VENUE</span>
          <strong>VELVET ROOM</strong>
          <span className="venue-status">
            <span className="online-indicator" />
            Workspace active
          </span>
        </div>

        <span className="venue-arrow">⌄</span>
      </div>

      <div className="sidebar-navigation">
        {navigation.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-title">{group.label}</div>

            {group.items.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                type="button"
                className={`nav-item ${
                  currentPath === path ? 'active' : ''
                }`}
                onClick={() => navigate(path)}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>

                {currentPath === path && (
                  <span className="nav-active-indicator" />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="system-status-light" />
          <div>
            <strong>SYSTEM OPERATIONAL</strong>
            <span>All modules initialized</span>
          </div>
        </div>

        <button
          type="button"
          className="public-site-link"
          onClick={() => navigate('/preview')}
        >
          <ExternalLink size={15} />
          <span>View public website</span>
        </button>

        <div className="sidebar-version">
          BARMAN SYSTEMS <span>© 2026</span>
        </div>
      </div>
    </aside>
  )
}