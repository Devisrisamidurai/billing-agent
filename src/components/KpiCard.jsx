/** Compact KPI tile for the dashboard header row. */
function KpiCard({ label, value, sub, tone = 'default' }) {
  return (
    <div className={`kpi-card kpi-card--${tone}`}>
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">{value}</p>
      {sub != null && <p className="kpi-card__sub">{sub}</p>}
    </div>
  )
}

export default KpiCard
