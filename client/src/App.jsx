import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Users,
  Wine,
  Plus,
  Search,
  ExternalLink,
  Check,
  X,
  Trash2,
  Eye,
  Save,
  Upload,
  Globe,
  Activity,
  Armchair,
  LayoutDashboard,
  Settings as SettingsIcon,
} from 'lucide-react'

import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Panel from './components/Panel'
import StatCard from './components/StatCard'
import StatusBadge from './components/StatusBadge'

const initialReservations = [
  {
    id: 1,
    name: 'Alex Morgan',
    email: 'alex@example.com',
    time: '18:30',
    date: '2026-10-29',
    guests: 4,
    status: 'CONFIRMED',
    table: 'T-04',
  },
  {
    id: 2,
    name: 'Jamie Wilson',
    email: 'jamie@example.com',
    time: '19:00',
    date: '2026-10-29',
    guests: 2,
    status: 'PENDING',
    table: '—',
  },
  {
    id: 3,
    name: 'Taylor Smith',
    email: 'taylor@example.com',
    time: '19:30',
    date: '2026-10-29',
    guests: 6,
    status: 'PENDING',
    table: '—',
  },
  {
    id: 4,
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    time: '20:00',
    date: '2026-10-29',
    guests: 3,
    status: 'CONFIRMED',
    table: 'T-02',
  },
  {
    id: 5,
    name: 'Casey Brown',
    email: 'casey@example.com',
    time: '21:00',
    date: '2026-10-29',
    guests: 2,
    status: 'COMPLETED',
    table: 'T-06',
  },
]

const initialMenu = [
  {
    id: 1,
    name: 'Old Fashioned',
    category: 'Cocktails',
    description: 'Bourbon, bitters, sugar',
    price: 1250,
    available: true,
  },
  {
    id: 2,
    name: 'Espresso Martini',
    category: 'Cocktails',
    description: 'Vodka, espresso, coffee liqueur',
    price: 1350,
    available: true,
  },
  {
    id: 3,
    name: 'Gin & Tonic',
    category: 'Cocktails',
    description: 'Gin, tonic, lime',
    price: 1100,
    available: true,
  },
  {
    id: 4,
    name: 'House Lemonade',
    category: 'Non-alcoholic',
    description: 'Fresh lemon, soda, mint',
    price: 650,
    available: true,
  },
]

const initialEvents = [
  {
    id: 1,
    title: 'FRIDAY SESSIONS',
    date: '2026-10-30',
    time: '21:00',
    description: 'A night of house music and cocktails.',
    published: true,
  },
  {
    id: 2,
    title: 'LATE NIGHT SELECTORS',
    date: '2026-11-06',
    time: '22:00',
    description: 'Guest DJs behind the decks.',
    published: false,
  },
]

function formatPrice(cents) {
  return (cents / 100).toLocaleString('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  })
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="section-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {action && <div className="section-title-action">{action}</div>}
    </div>
  )
}

function MetricIcon({ children }) {
  return <span className="metric-icon">{children}</span>
}

function Dashboard({ reservations, menu, events, navigate }) {
  const pending = reservations.filter(
    (item) => item.status === 'PENDING',
  ).length

  const confirmed = reservations.filter(
    (item) => item.status === 'CONFIRMED',
  ).length

  const publishedEvents = events.filter(
    (item) => item.published,
  ).length

  return (
    <>
      <SectionTitle
        eyebrow="CONTROL CENTER / OVERVIEW"
        title="Dashboard"
        description="An overview of your venue's operations."
        action={
          <button
            className="button button-primary"
            onClick={() => navigate('/reservations')}
          >
            <CalendarDays size={16} />
            Manage bookings
          </button>
        }
      />

      <div className="welcome-strip">
        <div className="welcome-mark">B.</div>

        <div>
          <div className="eyebrow">THURSDAY / 29 OCTOBER 2026</div>
          <h2>Good afternoon, Administrator.</h2>
          <p>Your venue overview is ready.</p>
        </div>

        <div className="welcome-status">
          <span className="online-indicator" />
          VENUE OPEN
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="TOTAL BOOKINGS"
          value={reservations.length}
          detail="All reservations"
          icon={CalendarDays}
        />

        <StatCard
          label="AWAITING CONFIRMATION"
          value={pending}
          detail="Require attention"
          icon={Clock3}
        />

        <StatCard
          label="CONFIRMED BOOKINGS"
          value={confirmed}
          detail="Ready for service"
          icon={Users}
        />

        <StatCard
          label="ACTIVE MENU ITEMS"
          value={menu.filter((item) => item.available).length}
          detail={`${menu.length} items configured`}
          icon={Wine}
        />
      </div>

      <div className="dashboard-grid">
        <Panel
          title="Recent reservations"
          label="01 / BOOKINGS"
          className="reservations-panel"
          action={
            <button
              className="text-button"
              onClick={() => navigate('/reservations')}
            >
              VIEW ALL <ArrowRight size={14} />
            </button>
          }
        >
          {reservations.length === 0 ? (
            <div className="empty-state">
              No reservations have been added.
            </div>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>GUEST</th>
                    <th>TIME</th>
                    <th>PARTY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.slice(0, 5).map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <div className="guest-cell">
                          <span className="guest-avatar">
                            {reservation.name.charAt(0)}
                          </span>

                          <div>
                            <strong>{reservation.name}</strong>
                            <span>{reservation.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>{reservation.time}</td>
                      <td>{reservation.guests} guests</td>

                      <td>
                        <StatusBadge status={reservation.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Venue status" label="02 / SYSTEM">
          <div className="venue-status-list">
            <div>
              <MetricIcon><Activity size={17} /></MetricIcon>
              <span>
                <strong>Management system</strong>
                <small>Frontend initialized</small>
              </span>
              <span className="status-text">ONLINE</span>
            </div>

            <div>
              <MetricIcon><Wine size={17} /></MetricIcon>
              <span>
                <strong>Menu configuration</strong>
                <small>{menu.length} items configured</small>
              </span>
              <span className="status-text">READY</span>
            </div>

            <div>
              <MetricIcon><CalendarDays size={17} /></MetricIcon>
              <span>
                <strong>Events</strong>
                <small>{publishedEvents} published</small>
              </span>
              <span className="status-text">READY</span>
            </div>
          </div>

          <div className="system-note">
            <span className="system-status-light" />
            DEMO MODE — DATABASE NOT CONNECTED
          </div>
        </Panel>

        <Panel
          title="Upcoming events"
          label="03 / SCHEDULE"
          className="events-overview-panel"
          action={
            <button
              className="text-button"
              onClick={() => navigate('/events')}
            >
              MANAGE <ArrowRight size={14} />
            </button>
          }
        >
          {events.filter((event) => event.published).length === 0 ? (
            <div className="empty-state">No published events.</div>
          ) : (
            <div className="event-list">
              {events
                .filter((event) => event.published)
                .map((event) => (
                  <div className="event-row" key={event.id}>
                    <div className="event-date">
                      <span>
                        {new Date(`${event.date}T12:00:00`)
                          .toLocaleDateString('en-GB', {
                            month: 'short',
                          })
                          .toUpperCase()}
                      </span>

                      <strong>{event.date.slice(-2)}</strong>
                    </div>

                    <div className="event-info">
                      <strong>{event.title}</strong>
                      <span>{event.time} / {event.description}</span>
                    </div>

                    <ArrowUpRight size={16} />
                  </div>
                ))}
            </div>
          )}
        </Panel>

        <Panel title="Quick actions" label="04 / SHORTCUTS">
          <div className="quick-actions">
            <button onClick={() => navigate('/reservations')}>
              <CalendarDays size={17} />
              <span>
                <strong>Reservations</strong>
                <small>Review guest bookings</small>
              </span>
              <ArrowRight size={15} />
            </button>

            <button onClick={() => navigate('/menu')}>
              <Wine size={17} />
              <span>
                <strong>Menu editor</strong>
                <small>Update your offerings</small>
              </span>
              <ArrowRight size={15} />
            </button>

            <button onClick={() => navigate('/website')}>
              <Globe size={17} />
              <span>
                <strong>Website studio</strong>
                <small>Customize your venue</small>
              </span>
              <ArrowRight size={15} />
            </button>
          </div>
        </Panel>
      </div>
    </>
  )
}

function ReservationsPage({ reservations, setReservations }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  const filtered = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.name.toLowerCase().includes(search.toLowerCase()) ||
      reservation.email.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      filter === 'ALL' || reservation.status === filter

    return matchesSearch && matchesStatus
  })

  function updateStatus(id, status) {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status }
          : reservation,
      ),
    )
  }

  return (
    <>
      <SectionTitle
        eyebrow="OPERATIONS / GUEST MANAGEMENT"
        title="Reservations"
        description="Review and manage incoming guest bookings."
      />

      <div className="stats-grid compact-stats">
        <StatCard
          label="ALL BOOKINGS"
          value={reservations.length}
          detail="Total records"
          icon={CalendarDays}
        />

        <StatCard
          label="PENDING"
          value={reservations.filter((item) => item.status === 'PENDING').length}
          detail="Awaiting action"
          icon={Clock3}
        />

        <StatCard
          label="CONFIRMED"
          value={reservations.filter((item) => item.status === 'CONFIRMED').length}
          detail="Confirmed guests"
          icon={Check}
        />

        <StatCard
          label="COMPLETED"
          value={reservations.filter((item) => item.status === 'COMPLETED').length}
          detail="Service completed"
          icon={Users}
        />
      </div>

      <Panel title="Booking register" label="RESERVATION DATABASE">
        <div className="table-toolbar">
          <label className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search guests..."
            />
          </label>

          <select
            className="select-control"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter reservation status"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>GUEST</th>
                <th>DATE</th>
                <th>TIME</th>
                <th>PARTY</th>
                <th>TABLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <div className="guest-cell">
                      <span className="guest-avatar">
                        {reservation.name.charAt(0)}
                      </span>
                      <div>
                        <strong>{reservation.name}</strong>
                        <span>{reservation.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>{reservation.guests}</td>
                  <td>{reservation.table}</td>

                  <td>
                    <StatusBadge status={reservation.status} />
                  </td>

                  <td>
                    <div className="row-actions">
                      {reservation.status === 'PENDING' && (
                        <button
                          className="small-action confirm-action"
                          onClick={() => updateStatus(reservation.id, 'CONFIRMED')}
                          aria-label={`Confirm ${reservation.name}`}
                          title="Confirm"
                        >
                          <Check size={15} />
                        </button>
                      )}

                      {reservation.status !== 'CANCELLED' &&
                        reservation.status !== 'COMPLETED' && (
                          <button
                            className="small-action cancel-action"
                            onClick={() => updateStatus(reservation.id, 'CANCELLED')}
                            aria-label={`Cancel ${reservation.name}`}
                            title="Cancel"
                          >
                            <X size={15} />
                          </button>
                        )}

                      {reservation.status === 'CONFIRMED' && (
                        <button
                          className="small-action"
                          onClick={() => updateStatus(reservation.id, 'COMPLETED')}
                          aria-label={`Complete ${reservation.name}`}
                          title="Mark completed"
                        >
                          <Check size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      No matching reservations found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function MenuPage({ menu, setMenu }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Cocktails')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  function addItem(event) {
    event.preventDefault()

    const parsedPrice = Number(price)

    if (!name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return
    }

    setMenu((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        category,
        description: description.trim(),
        price: Math.round(parsedPrice * 100),
        available: true,
      },
    ])

    setName('')
    setDescription('')
    setPrice('')
    setCategory('Cocktails')
    setShowForm(false)
  }

  function toggleAvailability(id) {
    setMenu((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item,
      ),
    )
  }

  function removeItem(id) {
    setMenu((current) => current.filter((item) => item.id !== id))
  }

  return (
    <>
      <SectionTitle
        eyebrow="OPERATIONS / CATALOGUE"
        title="Menu management"
        description="Manage your venue's menu and pricing."
        action={
          <button
            className="button button-primary"
            onClick={() => setShowForm((value) => !value)}
          >
            <Plus size={16} />
            Add item
          </button>
        }
      />

      {showForm && (
        <Panel title="New menu item" label="CATALOGUE / CREATE">
          <form className="form-grid" onSubmit={addItem}>
            <label className="field">
              <span>ITEM NAME</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. House lemonade"
              />
            </label>

            <label className="field">
              <span>CATEGORY</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Cocktails</option>
                <option>Beer</option>
                <option>Wine</option>
                <option>Non-alcoholic</option>
                <option>Food</option>
              </select>
            </label>

            <label className="field">
              <span>PRICE (€)</span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="12.50"
              />
            </label>

            <label className="field field-wide">
              <span>DESCRIPTION</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the item"
              />
            </label>

            <div className="form-actions field-wide">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="button button-primary">
                <Plus size={15} /> Create item
              </button>
            </div>
          </form>
        </Panel>
      )}

      <Panel title="Menu catalogue" label={`${menu.length} CONFIGURED ITEMS`}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>AVAILABILITY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {menu.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="menu-item-cell">
                      <span className="menu-item-icon">
                        <Wine size={18} />
                      </span>

                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.description || 'No description'}</span>
                      </div>
                    </div>
                  </td>

                  <td>{item.category}</td>
                  <td className="price-cell">{formatPrice(item.price)}</td>

                  <td>
                    <button
                      className={`availability-toggle ${
                        item.available ? 'is-available' : ''
                      }`}
                      onClick={() => toggleAvailability(item.id)}
                    >
                      <span />
                      {item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </button>
                  </td>

                  <td>
                    <button
                      className="small-action cancel-action"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Delete ${item.name}`}
                      title="Delete item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {menu.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">Your menu is empty.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function EventsPage({ events, setEvents }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('21:00')
  const [description, setDescription] = useState('')

  function addEvent(event) {
    event.preventDefault()

    if (!title.trim() || !date) return

    setEvents((current) => [
      ...current,
      {
        id: Date.now(),
        title: title.trim().toUpperCase(),
        date,
        time,
        description: description.trim(),
        published: false,
      },
    ])

    setTitle('')
    setDate('')
    setTime('21:00')
    setDescription('')
    setShowForm(false)
  }

  function togglePublished(id) {
    setEvents((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, published: !item.published }
          : item,
      ),
    )
  }

  return (
    <>
      <SectionTitle
        eyebrow="OPERATIONS / SCHEDULING"
        title="Events"
        description="Plan events and control what appears on your public website."
        action={
          <button
            className="button button-primary"
            onClick={() => setShowForm((value) => !value)}
          >
            <Plus size={16} /> Create event
          </button>
        }
      />

      {showForm && (
        <Panel title="Create event" label="SCHEDULE / NEW">
          <form className="form-grid" onSubmit={addEvent}>
            <label className="field">
              <span>EVENT TITLE</span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Friday sessions"
              />
            </label>

            <label className="field">
              <span>DATE</span>
              <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label className="field">
              <span>START TIME</span>
              <input
                required
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>

            <label className="field field-wide">
              <span>DESCRIPTION</span>
              <textarea
                rows="3"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell guests what to expect."
              />
            </label>

            <div className="form-actions field-wide">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button className="button button-primary" type="submit">
                <Plus size={15} /> Create event
              </button>
            </div>
          </form>
        </Panel>
      )}

      <div className="event-management-list">
        {events.map((event) => (
          <article className="managed-event" key={event.id}>
            <div className="managed-event-date">
              <span>{event.date.slice(5, 7)}</span>
              <strong>{event.date.slice(8, 10)}</strong>
              <small>{event.time}</small>
            </div>

            <div className="managed-event-content">
              <div className="eyebrow">VENUE EVENT / {event.id}</div>
              <h2>{event.title}</h2>
              <p>{event.description || 'No description added.'}</p>

              <StatusBadge status={event.published ? 'CONFIRMED' : 'PENDING'} />
              <span className="event-publish-label">
                {event.published ? 'PUBLICLY VISIBLE' : 'DRAFT'}
              </span>
            </div>

            <div className="managed-event-actions">
              <button
                className="button button-secondary"
                onClick={() => togglePublished(event.id)}
              >
                <Eye size={15} />
                {event.published ? 'Unpublish' : 'Publish'}
              </button>

              <button
                className="small-action cancel-action"
                onClick={() =>
                  setEvents((current) =>
                    current.filter((item) => item.id !== event.id),
                  )
                }
                aria-label={`Delete ${event.title}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}

        {events.length === 0 && (
          <Panel title="No events" label="SCHEDULE">
            <div className="empty-state">
              Create your first event to get started.
            </div>
          </Panel>
        )}
      </div>
    </>
  )
}

function WebsiteStudio({ accent, setAccent, background, setBackground, navigate }) {
  const [saved, setSaved] = useState(false)

  function savePreviewSettings() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <SectionTitle
        eyebrow="CONFIGURATION / WEBSITE"
        title="Website studio"
        description="Configure the visual identity of your public venue page."
        action={
          <button
            className="button button-primary"
            onClick={() => navigate('/preview')}
          >
            <Eye size={16} /> Open preview
          </button>
        }
      />

      <div className="studio-grid">
        <Panel title="Appearance" label="THEME CONFIGURATION">
          <div className="studio-controls">
            <label className="color-control">
              <span>
                <strong>Accent color</strong>
                <small>Buttons, borders and highlights</small>
              </span>

              <input
                type="color"
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
              />
            </label>

            <label className="color-control">
              <span>
                <strong>Background color</strong>
                <small>Main website background</small>
              </span>

              <input
                type="color"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
              />
            </label>

            <div className="studio-note">
              <Activity size={17} />
              <p>
                Changes update the preview immediately. Saving to your
                account requires a connected backend.
              </p>
            </div>

            <button
              className="button button-primary full-width"
              onClick={savePreviewSettings}
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Preview settings acknowledged' : 'Save settings'}
            </button>
          </div>
        </Panel>

        <Panel
          title="Live preview"
          label="PUBLIC WEBSITE / SIMULATION"
          action={
            <button
              className="text-button"
              onClick={() => navigate('/preview')}
            >
              EXPAND <ExternalLink size={13} />
            </button>
          }
        >
          <div
            className="website-preview"
            style={{
              '--preview-accent': accent,
              '--preview-bg': background,
            }}
          >
            <div className="preview-nav">
              <strong>VELVET ROOM</strong>
              <span>MENU</span>
              <span>EVENTS</span>
            </div>

            <div className="preview-hero">
              <div className="eyebrow">EST. 2024 / HELSINKI</div>
              <h2>YOUR NIGHT.<br />YOUR PLACE.</h2>
              <p>Good drinks. Good music. No ordinary nights.</p>
              <span className="preview-cta">RESERVE A TABLE ↗</span>
            </div>

            <div className="preview-bottom">
              <span>COCKTAILS</span>
              <span>MUSIC</span>
              <span>PEOPLE</span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Website sections" label="PAGE CONFIGURATION">
        <div className="section-config-list">
          {['Hero', 'Menu', 'Events', 'Reservations', 'Contact information'].map(
            (section, index) => (
              <div key={section}>
                <span className="section-config-number">
                  0{index + 1}
                </span>

                <strong>{section}</strong>

                <span className="section-config-status">
                  ENABLED
                </span>
              </div>
            ),
          )}
        </div>
      </Panel>
    </>
  )
}

function FloorPlan() {
  const [tables, setTables] = useState([
    { id: 1, name: 'T-01', seats: 2, status: 'AVAILABLE' },
    { id: 2, name: 'T-02', seats: 4, status: 'OCCUPIED' },
    { id: 3, name: 'T-03', seats: 4, status: 'AVAILABLE' },
    { id: 4, name: 'T-04', seats: 6, status: 'RESERVED' },
    { id: 5, name: 'T-05', seats: 2, status: 'AVAILABLE' },
    { id: 6, name: 'T-06', seats: 4, status: 'OCCUPIED' },
    { id: 7, name: 'T-07', seats: 6, status: 'AVAILABLE' },
    { id: 8, name: 'T-08', seats: 2, status: 'AVAILABLE' },
  ])

  function cycleTable(id) {
    const states = ['AVAILABLE', 'RESERVED', 'OCCUPIED']

    setTables((current) =>
      current.map((table) => {
        if (table.id !== id) return table

        const index = states.indexOf(table.status)

        return {
          ...table,
          status: states[(index + 1) % states.length],
        }
      }),
    )
  }

  return (
    <>
      <SectionTitle
        eyebrow="OPERATIONS / SEATING"
        title="Floor plan"
        description="A simple interactive overview of venue seating."
      />

      <Panel title="Main floor" label="SEATING OVERVIEW">
        <div className="floor-legend">
          <span><i className="legend-available" /> Available</span>
          <span><i className="legend-reserved" /> Reserved</span>
          <span><i className="legend-occupied" /> Occupied</span>
        </div>

        <div className="floor-grid">
          {tables.map((table) => (
            <button
              key={table.id}
              className={`floor-table table-${table.status.toLowerCase()}`}
              onClick={() => cycleTable(table.id)}
              title="Click to cycle table status"
            >
              <Armchair size={25} />
              <strong>{table.name}</strong>
              <span>{table.seats} SEATS</span>
              <small>{table.status}</small>
            </button>
          ))}
        </div>

        <p className="muted-note">
          Demo interaction: select a table to cycle its status.
          Database synchronization is not connected yet.
        </p>
      </Panel>
    </>
  )
}

function SettingsPage() {
  return (
    <>
      <SectionTitle
        eyebrow="CONFIGURATION / SYSTEM"
        title="Settings"
        description="Venue information and system configuration."
      />

      <Panel title="Venue information" label="GENERAL">
        <div className="settings-list">
          <div>
            <span>Venue name</span>
            <strong>Velvet Room</strong>
          </div>

          <div>
            <span>Public URL slug</span>
            <strong>/b/velvet-room</strong>
          </div>

          <div>
            <span>Application version</span>
            <strong>0.1.0 / DEVELOPMENT</strong>
          </div>

          <div>
            <span>Data storage</span>
            <strong className="warning-text">LOCAL DEMO STATE</strong>
          </div>
        </div>

        <div className="system-note">
          <SettingsIcon size={16} />
          These values are placeholders. Editing and persistent storage
          will be connected to the API in the next phase.
        </div>
      </Panel>
    </>
  )
}

function PublicPreview({ menu, events, accent, background, navigate }) {
  return (
    <div
      className="public-site"
      style={{
        '--preview-accent': accent,
        '--preview-bg': background,
      }}
    >
      <header className="public-header">
        <a className="public-logo" href="/preview">
          VELVET<span>ROOM</span>
        </a>

        <nav>
          <a href="#public-menu">MENU</a>
          <a href="#public-events">EVENTS</a>
          <a href="#public-contact">CONTACT</a>
        </nav>

        <button
          className="button button-primary"
          onClick={() => document.getElementById('public-contact')?.scrollIntoView()}
        >
          RESERVE A TABLE
        </button>
      </header>

      <main>
        <section className="public-hero">
          <div className="public-hero-copy">
            <div className="eyebrow">HELSINKI / EST. 2024</div>
            <h1>YOUR NIGHT.<br />YOUR PLACE.</h1>
            <p>
              Carefully crafted drinks, good music and a place to
              lose track of time.
            </p>

            <button
              className="button button-primary"
              onClick={() => document.getElementById('public-contact')?.scrollIntoView()}
            >
              DISCOVER VELVET ROOM <ArrowRight size={16} />
            </button>
          </div>

          <div className="public-hero-art">
            <div className="hero-art-inner">
              <span>V</span>
              <div>AFTER HOURS<br />H E L S I N K I</div>
            </div>
          </div>

          <div className="public-side-label">INDEPENDENT NIGHTLIFE / 001</div>
        </section>

        <section id="public-menu" className="public-section">
          <div className="public-section-heading">
            <div>
              <div className="eyebrow">01 / THE BAR</div>
              <h2>On the menu.</h2>
            </div>
            <span>SELECTED DRINKS</span>
          </div>

          <div className="public-menu-grid">
            {menu
              .filter((item) => item.available)
              .map((item) => (
                <article className="public-menu-item" key={item.id}>
                  <div>
                    <span>{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <strong>{formatPrice(item.price)}</strong>
                </article>
              ))}
          </div>
        </section>

        <section id="public-events" className="public-section public-events">
          <div className="public-section-heading">
            <div>
              <div className="eyebrow">02 / WHAT'S ON</div>
              <h2>Coming up.</h2>
            </div>
            <span>THE LATEST</span>
          </div>

          {events.filter((event) => event.published).length === 0 ? (
            <p>No upcoming events have been published.</p>
          ) : (
            events.filter((event) => event.published).map((event) => (
              <article className="public-event" key={event.id}>
                <div className="public-event-date">
                  {event.date} / {event.time}
                </div>

                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <ArrowUpRight size={20} />
              </article>
            ))
          )}
        </section>

        <section id="public-contact" className="public-contact">
          <div className="eyebrow">03 / FIND US</div>
          <h2>See you tonight.</h2>
          <p>Helsinki, Finland</p>
          <p className="muted-note">
            Public reservations will be enabled when the backend is connected.
          </p>
          <button
            className="button button-secondary"
            onClick={() => navigate('/dashboard')}
          >
            BACK TO BARMAN DEMO
          </button>
        </section>
      </main>

      <footer className="public-footer">
        VELVET ROOM <span>///</span> POWERED BY BARMAN
      </footer>
    </div>
  )
}

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