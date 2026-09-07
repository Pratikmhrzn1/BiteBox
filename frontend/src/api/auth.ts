import { get, post } from './http'

export type UserRole = 'CUSTOMER' | 'ADMIN'

export type AuthUser = {
  id: string
  name: string
  email: string
  phone: string | null
  role: UserRole
}

export type AuthResult = {
  user: AuthUser
  accessToken: string
}

export type RegisterInput = {
  name: string
  email: string
  phone?: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export const register = (input: RegisterInput) => post<AuthResult>('/auth/register', input)

export const login = (input: LoginInput) => post<AuthResult>('/auth/login', input)

export const fetchMe = (token: string) => get<AuthUser>('/auth/me', token)