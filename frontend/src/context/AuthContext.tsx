/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getToken, setToken } from '../api/http'
import { fetchMe, login as loginRequest, register as registerRequest } from '../api/auth'
import type { AuthResult, AuthUser, LoginInput, RegisterInput } from '../api/auth'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isChecking: boolean
  login: (input: LoginInput) => Promise<AuthResult>
  register: (input: RegisterInput) => Promise<AuthResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [isChecking, setIsChecking] = useState(() => Boolean(getToken()))

  useEffect(() => {
    const storedToken = getToken()
    if (!storedToken) return

    fetchMe(storedToken)
      .then((me) => setUser(me))
      .catch(() => {
        setToken(null)
        setTokenState(null)
      })
      .finally(() => setIsChecking(false))
  }, [])

  const applyAuth = useCallback((result: AuthResult) => {
    setToken(result.accessToken)
    setTokenState(result.accessToken)
    setUser(result.user)
    return result
  }, [])

  const login = useCallback(
    (input: LoginInput) => loginRequest(input).then(applyAuth),
    [applyAuth],
  )

  const register = useCallback(
    (input: RegisterInput) => registerRequest(input).then(applyAuth),
    [applyAuth],
  )

  const logout = useCallback(() => {
    setToken(null)
    setTokenState(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isChecking,
      login,
      register,
      logout,
    }),
    [user, token, isChecking, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}