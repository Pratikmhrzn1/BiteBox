import { del, get, patch, post } from './http'

export type MessageStatus = 'NEW' | 'READ' | 'ARCHIVED'

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: MessageStatus
  createdAt: string
}

export type ContactInput = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export const sendMessage = (input: ContactInput) =>
  post<{ id: string; receivedAt: string }>('/contact', input)

export const fetchMessages = (token: string) =>
  get<ContactMessage[]>('/contact', token)

export const updateMessageStatus = (
  id: string,
  status: MessageStatus,
  token: string,
) => patch<ContactMessage>(`/contact/${id}/status`, { status }, token)

export const deleteMessage = (id: string, token: string) =>
  del<{ id: string; deleted: true }>(`/contact/${id}`, token)
