export type ChatMessage = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isLoading?: boolean
  actionType?: "MENU_LIST" | "PLAN_LIST" | null
  data?: any[]
}

export type ChatSession = {
  id: string
  messages: ChatMessage[]
  createdAt: Date
}