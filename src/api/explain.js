import client from './client'

/**
 * POST /api/explain
 * @param {{ customerId: string, question: string, invoiceId?: string, trackingNumber?: string }} payload
 */
export async function explain(payload) {
  const { data } = await client.post('/api/explain', payload)
  return data
}
