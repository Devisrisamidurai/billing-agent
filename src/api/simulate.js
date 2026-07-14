import client from './client'
import { USE_MOCKS, mockClarify, mockSimulate } from './mocks'

/**
 * POST /api/simulate
 * @param {{ contractId: string, naturalLanguageQuery: string, conversationId?: string }} payload
 */
export async function simulate(payload) {
  if (USE_MOCKS) return mockSimulate(payload)
  const { data } = await client.post('/api/simulate', payload)
  return data
}

/**
 * POST /api/simulate/clarify
 * @param {{ contractId: string, conversationId: string, extractedParameters: Record<string, unknown> }} payload
 */
export async function clarify(payload) {
  if (USE_MOCKS) return mockClarify(payload)
  const { data } = await client.post('/api/simulate/clarify', payload)
  return data
}
