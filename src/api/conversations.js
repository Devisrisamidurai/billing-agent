import client from './client'
import {
  USE_MOCKS,
  mockConversationMessages,
  mockDeleteConversation,
  mockListConversations,
} from './mocks'

/** GET /api/conversations */
export async function listConversations() {
  if (USE_MOCKS) return mockListConversations()
  const { data } = await client.get('/api/conversations')
  return data
}

/** GET /api/conversations/{id}/messages */
export async function getConversationMessages(conversationId) {
  if (USE_MOCKS) return mockConversationMessages(conversationId)
  const { data } = await client.get(
    `/api/conversations/${conversationId}/messages`,
  )
  return data
}

/** DELETE /api/conversations/{id} */
export async function deleteConversation(conversationId) {
  if (USE_MOCKS) return mockDeleteConversation(conversationId)
  await client.delete(`/api/conversations/${conversationId}`)
}
