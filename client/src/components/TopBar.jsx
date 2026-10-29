import { Bell, CircleUserRound } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        <span className="brand-mark">B</span>
        <span>BARMAN<span className="brand-period">.</span></span>
      </a>

      <div className="topbar-center">
        <span className="online-indicator" />
        VENUE MANAGEMENT SYSTEM
        <span className="version">BUILD 0.1.0</span>
      </div>

      <div className="topbar-right">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={17} />
        </button>

        <div className="user-chip">
          <CircleUserRound size={18} />
          <span>ADMINISTRATOR</span>
        </div>
      </div>
    </header>
  )
}