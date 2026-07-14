import client from './client'
import { USE_MOCKS, mockCostTrend, mockDashboardSummary } from './mocks'

/** GET /api/dashboard/summary */
export async function getDashboardSummary() {
  if (USE_MOCKS) return mockDashboardSummary()
  const { data } = await client.get('/api/dashboard/summary')
  return data
}

/** GET /api/dashboard/cost-trend */
export async function getCostTrend() {
  if (USE_MOCKS) return mockCostTrend()
  const { data } = await client.get('/api/dashboard/cost-trend')
  return data
}
