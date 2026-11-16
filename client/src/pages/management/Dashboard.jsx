import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, Users, Wine, Activity, Globe } from 'lucide-react'
import Panel from '../../components/Panel'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import SectionTitle from '../../components/SectionTitle'
import MetricIcon from '../../components/MetricIcon'

export default function Dashboard({ reservations, menu, events, navigate }) {
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

