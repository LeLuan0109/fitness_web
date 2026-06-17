import { sendChatMessage } from "@/api/chatbot.api"
import { Button } from "@/components/shared/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { ScrollArea } from "@/components/shared/ui/scroll-area"
import authStore from "@/stores/auth.store"
import type { ChatMessage as ChatMessageType } from "@/types/chatbot.type"
import { Bot, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { ChatInput } from "./ChatInput"
import { ChatMessage } from "./ChatMessage"

type ChatWindowProps = {
  onClose: () => void
}

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const auth = authStore.use.auth() // auth có kiểu TAuth | undefined
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      content: "Xin chào! Tôi là trợ lý ảo FitBot. Bạn cần hỗ trợ gì về lịch tập hay dinh dưỡng không?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    const botLoadingId = (Date.now() + 1).toString()
    const botMessageLoading: ChatMessageType = {
      id: botLoadingId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMessage, botMessageLoading])
    setIsLoading(true)

    try {
      // FIX: auth chính là user info, dùng auth.id thay vì auth.user.id
      if (!auth?.id) throw new Error("Vui lòng đăng nhập")

      const res = await sendChatMessage(auth.id, content)

      if (res.status) {
        // FIX: Lấy data từ res.data (đã được định nghĩa đúng kiểu ChatBotData)
        const { message, actionType, data } = res.data

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botLoadingId
              ? {
                  ...msg,
                  content: message,
                  actionType: actionType,
                  data: data,
                  isLoading: false,
                }
              : msg,
          ),
        )
      }
    } catch (error) {
      console.error(error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botLoadingId
            ? { ...msg, content: "Hệ thống đang bận, vui lòng thử lại sau.", isLoading: false }
            : msg,
        ),
      )
      toast.error("Gửi tin nhắn thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "reset",
        content: "Đã xóa lịch sử chat. Bạn cần giúp gì không?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <Card className="fixed bottom-12 right-6 w-[400px] h-[500px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-300 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
            <Bot className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-primary">FitBot AI</CardTitle>
            <p className="text-[10px] text-muted-foreground">Trợ lý sức khỏe</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="size-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-8 text-muted-foreground">
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <ScrollArea className="flex-1 px-4 h-full">
          <div className="py-4 flex flex-col gap-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>
      </div>

      <div className="shrink-0">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </Card>
  )
}
