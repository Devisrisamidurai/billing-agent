import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatMoney, formatPercent } from '../utils/format'

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const baseline = payload.find((p) => p.dataKey === 'baselineCost')?.value ?? 0
  const projected = payload.find((p) => p.dataKey === 'projectedCost')?.value ?? 0
  const delta = projected - baseline
  const pct = baseline ? (delta / baseline) * 100 : 0
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__title">{label}</p>
      <p>Baseline: {formatMoney(baseline)}</p>
      <p>Projected: {formatMoney(projected)}</p>
      <p className={delta <= 0 ? 'pos' : 'neg'}>
        Δ {formatMoney(delta)} ({formatPercent(pct, { sign: true })})
      </p>
    </div>
  )
}

/** Grouped bar chart comparing baseline vs projected cost per simulation. */
function CostTrendChart({ points }) {
  if (!points?.length) {
    return <p className="chart-empty">No simulations yet to chart.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee3db" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b6b6b' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b6b6b' }}
          tickFormatter={(v) => formatMoney(v)}
          width={70}
        />
        <Tooltip content={<TrendTooltip />} cursor={{ fill: 'rgba(255,181,0,0.08)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="baselineCost" name="Baseline" fill="#341b14" radius={[4, 4, 0, 0]} />
        <Bar dataKey="projectedCost" name="Projected" fill="#ffb500" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default CostTrendChart
