import { ArrowRight, ArrowUpRight } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle'
import { formatPrice } from '../../utils/formatPrice'

export default function PublicPreview({ menu, events, accent, background, navigate }) {
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

