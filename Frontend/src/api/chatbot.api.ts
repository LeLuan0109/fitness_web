import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"

// Type cho dữ liệu thật bên trong
export type ChatBotData = {
  message: string
  actionType: "MENU_LIST" | "PLAN_LIST" | null
  data: any[]
}

// Type cho Wrapper Response (ApiResponse)
export type ChatResponse = {
  status: boolean
  data: ChatBotData
}

export const sendChatMessage = (userId: string | number, message: string) => {
  // FIX: Với wrapper http.ts của dự án này, phải bọc body trong 'data'
  return http.post<ChatResponse>(API_ENDPOINTS.CHATBOT.CHAT.replace(":userId", userId.toString()), {
    data: { message },
  })
}

// Phân tích số liệu tập luyện/dinh dưỡng bằng AI. type: PROGRESS | NUTRITION | OVERALL
export const analyzeTraining = (userId: string | number, type: string) => {
  return http.post<ChatResponse>(API_ENDPOINTS.CHATBOT.ANALYZE.replace(":userId", userId.toString()), {
    data: { message: type },
  })
}