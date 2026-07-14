import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_COLORS, formatMoney } from '../utils/format'

/** Donut of cost-by-category for the current baseline. */
function CostBreakdownDonut({ data }) {
  const entries = Object.entries(data ?? {}).map(([name, value]) => ({
    name,
    value,
  }))

  if (entries.length === 0) {
    return <p className="chart-empty">No cost breakdown available.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={entries}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {entries.map((entry, i) => (
            <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatMoney(value)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CostBreakdownDonut
