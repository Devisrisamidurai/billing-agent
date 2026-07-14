import { useNavigate } from 'react-router-dom'
import { getCostTrend, getDashboardSummary } from '../api/dashboard'
import { getRecommendations } from '../api/recommendations'
import CostBreakdownDonut from '../components/CostBreakdownDonut'
import CostTrendChart from '../components/CostTrendChart'
import KpiCard from '../components/KpiCard'
import RecommendationsPanel from '../components/RecommendationsPanel'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { formatMoney, formatPercent } from '../utils/format'
import './dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const summary = useFetch(getDashboardSummary)
  const trend = useFetch(getCostTrend)
  const recos = useFetch(getRecommendations)

  const s = summary.data
  const savings =
    s?.latestAnnualDelta != null ? -s.latestAnnualDelta : null

  const usePrompt = (prompt) =>
    navigate('/chat', { state: { prompt } })

  return (
    <div className="dashboard">
      <header className="dashboard__head">
        <h1 className="dashboard__title">
          {s?.companyName ? `${s.companyName} dashboard` : 'Dashboard'}
        </h1>
        <p className="dashboard__subtitle">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Figures
          below are <strong>projections</strong>, not quotes.
        </p>
      </header>

      {summary.error ? (
        <div className="dashboard__error">
          Couldn&apos;t load your summary.{' '}
          <button type="button" className="link-btn" onClick={summary.refetch}>
            Retry
          </button>
        </div>
      ) : (
        <div className="dashboard__kpis">
          {summary.loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="kpi-card kpi-card--skeleton" />
            ))
          ) : (
            <>
              <KpiCard
                label="Baseline annual cost"
                value={formatMoney(s.baselineAnnualCost)}
              />
              <KpiCard
                label="Latest projected cost"
                value={
                  s.latestProjectedAnnualCost != null
                    ? formatMoney(s.latestProjectedAnnualCost)
                    : '—'
                }
                sub={
                  s.latestAnnualDelta != null
                    ? `${formatPercent(
                        (s.latestAnnualDelta / s.baselineAnnualCost) * 100,
                        { sign: true },
                      )} vs baseline`
                    : 'Run a simulation'
                }
              />
              <KpiCard
                label="Projected savings"
                tone={savings != null && savings > 0 ? 'positive' : savings != null && savings < 0 ? 'negative' : 'default'}
                value={savings != null ? formatMoney(savings) : '—'}
                sub={savings != null ? 'per year' : null}
              />
              <KpiCard
                label="Avg weekly volume"
                value={`${s.avgWeeklyVolume} shipments`}
                sub={`Tier band ${s.currentDiscountTierBand}`}
              />
            </>
          )}
        </div>
      )}

      <div className="dashboard__grid">
        <section className="panel panel--wide">
          <h2 className="panel-title">Baseline vs projected</h2>
          {trend.loading ? (
            <div className="panel__skeleton" />
          ) : trend.error ? (
            <p className="panel-empty">Couldn&apos;t load cost trend.</p>
          ) : (
            <CostTrendChart points={trend.data} />
          )}
        </section>

        <section className="panel">
          <h2 className="panel-title">Cost breakdown</h2>
          {summary.loading ? (
            <div className="panel__skeleton" />
          ) : (
            <CostBreakdownDonut data={s?.costByCategory} />
          )}
        </section>

        <RecommendationsPanel
          items={recos.data}
          loading={recos.loading}
          error={recos.error}
          onUse={usePrompt}
        />
      </div>
    </div>
  )
}

export default Dashboard
