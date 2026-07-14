import MiniComparisonChart from './MiniComparisonChart'
import { formatMoney, formatPercent } from '../utils/format'

/**
 * Assistant result card: plain-English explanation + current-vs-projected
 * chart + savings badge + confidence pill + projection disclaimer.
 */
function ResultCard({ result, disclaimer }) {
  const {
    currentInvoiceTotal,
    projectedInvoiceTotal,
    estimatedSavings,
    savingsPercentage,
    confidenceLevel,
    explanation,
  } = result

  const isSaving = estimatedSavings > 0

  return (
    <div className="result-card">
      {explanation && <p className="result-card__text">{explanation}</p>}

      <MiniComparisonChart
        current={currentInvoiceTotal}
        projected={projectedInvoiceTotal}
      />

      <div className="result-card__stats">
        <span
          className={`result-badge ${isSaving ? 'result-badge--save' : 'result-badge--increase'}`}
        >
          {isSaving ? 'Saves ' : 'Increase '}
          {formatMoney(Math.abs(estimatedSavings))}
          {savingsPercentage != null &&
            ` (${formatPercent(savingsPercentage, { sign: true })})`}
        </span>
        {confidenceLevel && (
          <span className={`confidence-pill confidence-pill--${confidenceLevel.toLowerCase()}`}>
            {confidenceLevel} confidence
          </span>
        )}
      </div>

      {disclaimer && <p className="result-card__disclaimer">{disclaimer}</p>}
    </div>
  )
}

export default ResultCard
