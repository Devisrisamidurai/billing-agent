import client from './client'
import { USE_MOCKS, mockRecommendations } from './mocks'

/** GET /api/recommendations */
export async function getRecommendations() {
  if (USE_MOCKS) return mockRecommendations()
  const { data } = await client.get('/api/recommendations')
  return data
}
