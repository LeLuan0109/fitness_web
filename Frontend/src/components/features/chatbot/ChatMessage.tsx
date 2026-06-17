import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType } from "@/types/chatbot.type"
import { Avatar, AvatarFallback } from "@/components/shared/ui/avatar"
import { ChatSuggestionList } from "./ChatSuggestionList"

type ChatMessageProps = {
  message: ChatMessageType
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user"

  const formatContent = (text: string) => {
    const cleanText = text.replace(/\[ACTION:.*?\]/g, "").trim()
    return cleanText
  }

  return (
    // FIX 1: Thêm w-full để container luôn chiếm đủ chiều rộng
    <div className={cn("flex w-full gap-3 items-start", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="size-8 shrink-0 shadow-sm border mt-1">
        <AvatarFallback className={cn(isUser ? "bg-primary text-primary-foreground" : "bg-white text-primary")}>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col max-w-[85%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed",
            // FIX 2: Thêm 'break-words' để text dài tự xuống dòng, tránh tràn khung
            "break-words whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted/50 border text-foreground rounded-tl-none",
            message.isLoading && "animate-pulse min-w-[60px]",
          )}
        >
          {message.isLoading ? (
            <div className="flex gap-1 py-1 justify-center">
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          ) : (
            formatContent(message.content)
          )}
        </div>

        {!isUser && !message.isLoading && message.actionType && message.data && message.data.length > 0 && (
          <ChatSuggestionList type={message.actionType} items={message.data} />
        )}
      </div>
    </div>
  )
}
