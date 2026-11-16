import { useState } from 'react'
import { Plus, Eye, Trash2 } from 'lucide-react'
import Panel from '../../components/Panel'
import StatusBadge from '../../components/StatusBadge'
import SectionTitle from '../../components/SectionTitle'

export default function EventsPage({ events, setEvents }) {
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

