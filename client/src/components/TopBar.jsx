
import { Bell, CircleUserRound, LogOut } from 'lucide-react'

export default function TopBar({ user, onLogout }) {
  return (
    <header className="topbar">
      <a className="brand" href="/dashboard">
        <span className="brand-mark">B</span>
        <span>BARMAN<span className="brand-period">.</span></span>
      </a>

      <div className="topbar-center">
        <span className="online-indicator" />
        VENUE MANAGEMENT SYSTEM
        <span className="version">BUILD 0.2.0</span>
      </div>

      <div className="topbar-right">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={17} />
        </button>

        <div className="user-chip">
          <CircleUserRound size={18} />
          <span>{user?.name?.toUpperCase() || 'OWNER'}</span>
        </div>

        <button
          className="icon-button"
          onClick={onLogout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
