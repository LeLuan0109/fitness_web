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
          "fixed bottom-6 right-6 z-50 size-14 rounded-full bg-clay text-cream shadow-lg shadow-earth/20 transition-all hover:scale-110 hover:bg-earth",
          isOpen && "scale-0",
        )}
        aria-label="Toggle chatbot"
      >
        <Bot className="size-6" />
      </Button>
    </>
  )
}
