import client from './client'
import { USE_MOCKS, mockSearch } from './mocks'

/** GET /api/search?q= */
export async function search(query) {
  if (USE_MOCKS) return mockSearch(query)
  const { data } = await client.get('/api/search', { params: { q: query } })
  return data
}
