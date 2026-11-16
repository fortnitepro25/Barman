import { useState } from 'react'
import { CalendarDays, Clock3, Users, Check, Search, X } from 'lucide-react'
import Panel from '../../components/Panel'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import SectionTitle from '../../components/SectionTitle'

export default function ReservationsPage({ reservations, setReservations }) {
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

