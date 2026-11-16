import { Settings as SettingsIcon } from 'lucide-react'
import Panel from '../../components/Panel'
import SectionTitle from '../../components/SectionTitle'

export default function SettingsPage() {
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

