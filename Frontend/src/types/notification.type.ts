export type RegisterTokenRequest = {
  token: string
  deviceType: string
}

export type Notification = {
  id: number
  title: string
  content: string
  type: string
  referenceId?: number
  referenceUrl?: string
  isRead: boolean
  createdAt: string
}
