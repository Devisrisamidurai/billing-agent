/** Shared formatting + presentation helpers. */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const usdCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format a number as USD. Large totals drop the cents. */
export function formatMoney(value, { cents = false } = {}) {
  if (value == null || Number.isNaN(value)) return '—'
  return cents ? usdCents.format(value) : usd.format(value)
}

/** Format a fractional/whole percentage with a sign. */
export function formatPercent(value, { sign = false } = {}) {
  if (value == null || Number.isNaN(value)) return '—'
  const formatted = `${Math.abs(value).toFixed(1)}%`
  if (!sign) return formatted
  return value < 0 ? `-${formatted}` : `+${formatted}`
}

/** Relative day bucket used to group conversation history. */
export function dayBucket(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.floor((startOfToday - date) / 86400000)
  if (date >= startOfToday) return 'Today'
  if (diffDays <= 1) return 'Yesterday'
  if (diffDays <= 7) return 'Previous 7 days'
  return 'Older'
}

/** Chart palette aligned with the UPS brown / gold theme. */
export const CHART_COLORS = [
  '#341b14',
  '#ffb500',
  '#8a5a3b',
  '#c99a4e',
  '#5a3826',
  '#e0a000',
  '#a9866a',
]
