/**
 * Demo / mock data layer.
 *
 * When mocks are enabled (see USE_MOCKS below) the API modules short-circuit
 * to these functions instead of calling the backend, so the whole dashboard
 * is explorable with no server running.
 *
 * Turn it OFF to hit the real backend by adding to a `.env` file:
 *   VITE_USE_MOCKS=false
 */

// Default ON so the app is runnable out of the box. Set VITE_USE_MOCKS=false
// (and run the Java backend on :8080) to use live data.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

// --- Demo account -----------------------------------------------------------
export const DEMO_USER = {
  email: 'demo@ups.com',
  password: 'Demo2026!',
}

const DEMO_AUTH = {
  token: 'demo.jwt.token',
  userId: '00000000-0000-0000-0000-000000000001',
  companyId: '00000000-0000-0000-0000-0000000000aa',
  name: 'Dana Demo',
  email: DEMO_USER.email,
  role: 'CUSTOMER',
}

const BASELINE_ANNUAL = 502000
const BASELINE_BY_CATEGORY = {
  Transportation: 331320,
  Fuel: 90360,
  Accessorial: 55220,
  Residential: 25100,
}

// --- Auth -------------------------------------------------------------------
export async function mockLogin({ email, password }) {
  await delay()
  const ok =
    email.toLowerCase() === DEMO_USER.email &&
    password === DEMO_USER.password
  if (!ok) {
    const err = new Error('Invalid credentials')
    err.response = { status: 401, data: { message: 'Invalid email or password.' } }
    throw err
  }
  return { ...DEMO_AUTH, email }
}

export async function mockSignup() {
  await delay()
  return { message: 'Account created. You can now log in.' }
}

// --- Dashboard --------------------------------------------------------------
export async function mockDashboardSummary() {
  await delay()
  return {
    companyName: 'Acme Logistics',
    baselineAnnualCost: BASELINE_ANNUAL,
    avgWeeklyVolume: 20,
    currentDiscountTierBand: '44% (Ground)',
    latestProjectedAnnualCost: 548900,
    latestAnnualDelta: 46900, // positive = increase
    totalSimulationsRun: 6,
    costByCategory: BASELINE_BY_CATEGORY,
  }
}

export async function mockCostTrend() {
  await delay()
  return [
    { label: 'Baseline', baselineCost: 502000, projectedCost: 502000, createdAt: '2026-06-01' },
    { label: '25/wk', baselineCost: 502000, projectedCost: 542300, createdAt: '2026-06-15' },
    { label: '2-Day shift', baselineCost: 502000, projectedCost: 571800, createdAt: '2026-06-22' },
    { label: 'Zone remix', baselineCost: 502000, projectedCost: 489600, createdAt: '2026-07-01' },
    { label: '35/wk', baselineCost: 502000, projectedCost: 548900, createdAt: '2026-07-10' },
  ]
}

export async function mockRecommendations() {
  await delay()
  return [
    {
      id: 'rec-1',
      title: 'Grow to 26 shipments/week to reach the 48% discount band',
      prompt: 'What if I ship 26 packages a week instead of 20?',
      type: 'OPTIMIZE',
      estimatedAnnualSavings: 21400,
    },
    {
      id: 'rec-2',
      title: 'Shift residential deliveries to Ground to cut surcharges',
      prompt: 'How much could I save by moving residential volume to Ground?',
      type: 'SUGGESTION',
      estimatedAnnualSavings: 12800,
    },
    {
      id: 'rec-3',
      title: 'Review accessorial fees driving up your invoice',
      prompt: 'What accessorial fees are driving my bill up?',
      type: 'SUGGESTION',
    },
  ]
}

// --- Conversations ----------------------------------------------------------
const CONVERSATIONS = [
  {
    conversationId: 'conv-1001',
    title: 'Shipping 35/week',
    lastMessagePreview: 'Projected annual cost rises to ~$548,900.',
    updatedAt: new Date().toISOString(),
    messageCount: 2,
  },
  {
    conversationId: 'conv-1002',
    title: '2-Day service shift',
    lastMessagePreview: 'Switching to 2-Day adds roughly $69,800/yr.',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messageCount: 2,
  },
  {
    conversationId: 'conv-1003',
    title: 'Zone mix optimization',
    lastMessagePreview: 'Re-mixing zones could save about $12,400/yr.',
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    messageCount: 2,
  },
]

const MESSAGES = {
  'conv-1001': [
    { messageId: 'm1', role: 'USER', content: 'What if I ship 35 packages a week instead of 20?', createdAt: '' },
    {
      messageId: 'm2',
      role: 'ASSISTANT',
      content:
        'Shipping 35 packages/week (up from 20) increases volume by 75%. Even with a better discount band, your projected annual cost rises to about $548,900 — a $46,900 increase. This is a projection, not a quote.',
      createdAt: '',
    },
  ],
  'conv-1002': [
    { messageId: 'm3', role: 'USER', content: 'How much would switching to 2-Day service cost?', createdAt: '' },
    {
      messageId: 'm4',
      role: 'ASSISTANT',
      content:
        'Moving your current volume to 2-Day service raises the transportation rate significantly, adding roughly $69,800/yr for a projected total near $571,800.',
      createdAt: '',
    },
  ],
  'conv-1003': [
    { messageId: 'm5', role: 'USER', content: 'Can I save by remixing delivery zones?', createdAt: '' },
    {
      messageId: 'm6',
      role: 'ASSISTANT',
      content:
        'Shifting more volume into closer zones (2–4) lowers your blended rate. Projected annual cost drops to about $489,600 — a $12,400 saving.',
      createdAt: '',
    },
  ],
}

export async function mockListConversations() {
  await delay()
  return CONVERSATIONS
}

export async function mockConversationMessages(id) {
  await delay()
  return MESSAGES[id] ?? []
}

export async function mockDeleteConversation() {
  await delay(150)
}

// --- Search -----------------------------------------------------------------
export async function mockSearch(query) {
  await delay(200)
  const q = query.toLowerCase()
  const results = [
    ...CONVERSATIONS.map((c) => ({
      type: 'CONVERSATION',
      id: c.conversationId,
      title: c.title,
      snippet: c.lastMessagePreview,
    })),
    {
      type: 'SCENARIO',
      id: 'scn-1',
      title: 'Volume change: 35/week',
      snippet: 'VOLUME_CHANGE — projected +$46,900/yr',
    },
    {
      type: 'ARTICLE',
      id: 'art-1',
      title: 'How fuel surcharges are calculated',
      snippet: 'Fuel is a percentage of transportation charges, updated weekly.',
    },
  ]
  return results.filter(
    (r) =>
      r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q),
  )
}

// --- Simulate ---------------------------------------------------------------
export async function mockSimulate({ naturalLanguageQuery, conversationId }) {
  await delay(700)
  const convId = conversationId || `conv-${Date.now()}`

  // Ask for clarification when the question is too vague.
  if (naturalLanguageQuery.trim().split(/\s+/).length < 3) {
    return {
      status: 'NEEDS_CLARIFICATION',
      conversationId: convId,
      clarificationQuestions: [
        {
          field: 'weeklyVolume',
          question: 'About how many packages do you ship per week?',
          suggestedOptions: ['20', '35', '50', '100'],
        },
      ],
      disclaimer: 'Figures are projections, not quotes.',
    }
  }

  const match = naturalLanguageQuery.match(/\d+/)
  const newVolume = match ? Number(match[0]) : 35
  const ratio = newVolume / 20
  const projected = Math.round(BASELINE_ANNUAL * ratio * 0.83) // discount improves with scale
  const savings = BASELINE_ANNUAL - projected
  const scale = (n) => Math.round(n * ratio * 0.83)

  return {
    status: 'SUCCESS',
    conversationId: convId,
    disclaimer:
      'This is a projection based on your current rate card, not a binding quote. Actual invoices vary with real shipment mix.',
    result: {
      simulationId: `sim-${Date.now()}`,
      currentInvoiceTotal: BASELINE_ANNUAL,
      projectedInvoiceTotal: projected,
      estimatedSavings: savings,
      savingsPercentage: (savings / BASELINE_ANNUAL) * 100,
      currentBreakdown: BASELINE_BY_CATEGORY,
      projectedBreakdown: {
        Transportation: scale(BASELINE_BY_CATEGORY.Transportation),
        Fuel: scale(BASELINE_BY_CATEGORY.Fuel),
        Accessorial: scale(BASELINE_BY_CATEGORY.Accessorial),
        Residential: scale(BASELINE_BY_CATEGORY.Residential),
      },
      confidenceLevel: 'MEDIUM',
      explanation:
        `Shipping about ${newVolume} packages/week (vs. your baseline of 20) changes your projected ` +
        `annual cost to ${projected.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}. ` +
        (savings >= 0
          ? `That is an estimated saving of ${Math.abs(savings).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} per year.`
          : `That is an estimated increase of ${Math.abs(savings).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} per year.`) +
        ' This is a projection, not a quote.',
    },
  }
}

export async function mockClarify(payload) {
  const volume = payload.extractedParameters?.weeklyVolume ?? '35'
  return mockSimulate({
    naturalLanguageQuery: `ship ${volume} packages per week`,
    conversationId: payload.conversationId,
  })
}
