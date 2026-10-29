const statusClasses = {
  CONFIRMED: 'status-confirmed',
  PENDING: 'status-pending',
  CANCELLED: 'status-cancelled',
  COMPLETED: 'status-completed',
}

export default function StatusBadge({ status }) {
  const normalized = String(status || 'PENDING').toUpperCase()

  return (
    <span
      className={`status-badge ${statusClasses[normalized] || ''}`}
    >
      <span className="status-dot" />
      {normalized}
    </span>
  )
}