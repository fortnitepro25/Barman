import { ArrowUpRight } from 'lucide-react'

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span>{label}</span>

        {Icon && (
          <span className="stat-icon">
            <Icon size={17} />
          </span>
        )}
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-detail">
        <span>{detail}</span>
        <ArrowUpRight size={14} />
      </div>
    </article>
  )
}