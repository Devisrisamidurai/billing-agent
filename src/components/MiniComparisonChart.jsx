import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatMoney } from '../utils/format'

/**
 * Small current-vs-projected comparison chart shown inside an assistant
 * result card. Renders two bars: current total and projected total.
 */
function MiniComparisonChart({ current, projected }) {
  const data = [
    { name: 'Current', value: current, fill: '#341b14' },
    { name: 'Projected', value: projected, fill: '#ffb500' },
  ]
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b6b6b' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b6b6b' }}
          tickFormatter={(v) => formatMoney(v)}
          width={64}
        />
        <Tooltip formatter={(value) => formatMoney(value)} cursor={{ fill: 'rgba(255,181,0,0.08)' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default MiniComparisonChart
