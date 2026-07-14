import { formatMoney } from '../utils/format'

/** List of suggested prompts / optimization hints that seed the chat. */
function RecommendationsPanel({ items, loading, error, onUse }) {
  return (
    <section className="reco">
      <h2 className="panel-title">Recommendations</h2>

      {loading && (
        <div className="reco__skeletons" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="reco__skeleton" />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="panel-empty">Couldn&apos;t load recommendations.</p>
      )}

      {!loading && !error && (!items || items.length === 0) && (
        <p className="panel-empty">No recommendations right now.</p>
      )}

      {!loading && !error && items?.length > 0 && (
        <ul className="reco__list">
          {items.map((rec) => (
            <li key={rec.id}>
              <button
                type="button"
                className="reco__card"
                onClick={() => onUse(rec.prompt)}
              >
                <span className={`reco__tag reco__tag--${rec.type?.toLowerCase()}`}>
                  {rec.type === 'OPTIMIZE' ? 'Optimize' : 'Suggestion'}
                </span>
                <span className="reco__card-title">{rec.title}</span>
                {rec.estimatedAnnualSavings != null && (
                  <span className="reco__savings">
                    Est. {formatMoney(rec.estimatedAnnualSavings)}/yr
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default RecommendationsPanel
