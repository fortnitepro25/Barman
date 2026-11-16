import { useState } from 'react'
import { Eye, ExternalLink, Activity, Save, Check } from 'lucide-react'
import Panel from '../../components/Panel'
import SectionTitle from '../../components/SectionTitle'

export default function WebsiteStudio({ accent, setAccent, background, setBackground, navigate }) {
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

