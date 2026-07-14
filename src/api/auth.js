import client from './client'
import { USE_MOCKS, mockLogin, mockSignup } from './mocks'

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {string} userId
 * @property {string} companyId
 * @property {string} name
 * @property {string} email
 * @property {'CUSTOMER' | 'ADMIN'} role
 */

/** POST /api/auth/login */
export async function login({ email, password }) {
  if (USE_MOCKS) return mockLogin({ email, password })
  const { data } = await client.post('/api/auth/login', { email, password })
  return data
}

/** POST /api/auth/signup */
export async function signup({ name, accessKey, email, password, confirmPassword }) {
  if (USE_MOCKS) return mockSignup({ name, accessKey, email, password, confirmPassword })
  const { data } = await client.post('/api/auth/signup', {
    name,
    accessKey,
    email,
    password,
    confirmPassword,
  })
  return data
}
