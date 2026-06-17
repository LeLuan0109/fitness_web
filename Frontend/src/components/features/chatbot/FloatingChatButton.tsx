import { Bot } from "lucide-react"
import { useState } from "react"
import { ChatWindow } from "./ChatWindow"
import { Button } from "@/components/shared/ui/button"
import { cn } from "@/lib/utils"

export const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 size-14 rounded-full shadow-lg z-50 transition-transform hover:scale-110",
          isOpen && "scale-0",
        )}
        aria-label="Toggle chatbot"
      >
        <Bot className="size-6" />
      </Button>
    </>
  )
}
