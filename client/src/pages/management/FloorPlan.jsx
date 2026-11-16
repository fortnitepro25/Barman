import { useState } from 'react'
import { Armchair } from 'lucide-react'
import Panel from '../../components/Panel'
import SectionTitle from '../../components/SectionTitle'

export default function FloorPlan() {
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

