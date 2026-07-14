import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { TOKEN_KEY, USER_KEY } from '../api/client'
import { login as loginApi, signup as signupApi } from '../api/auth'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const persist = useCallback((auth) => {
    const { token: nextToken, ...profile } = auth
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setToken(nextToken)
    setUser(profile)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const auth = await loginApi(credentials)
      persist(auth)
      return auth
    },
    [persist],
  )

  const signup = useCallback(async (payload) => {
    return signupApi(payload)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, signup, logout }),
    [user, token, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
