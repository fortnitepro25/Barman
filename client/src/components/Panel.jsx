export default function Panel({
  title,
  label,
  action,
  children,
  className = '',
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        <div className="panel-heading-title">
          {label && <span className="panel-label">{label}</span>}
          <h2>{title}</h2>
        </div>

        {action && (
          <div className="panel-action">
            {action}
          </div>
        )}
      </div>

      <div className="panel-body">
        {children}
      </div>
    </section>
  )
}