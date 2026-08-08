import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Input } from "@/components/shared/ui/input"
import { cn } from "@/lib/utils"

interface CreatePostProps {
  userAvatar?: string
  userName?: string
  onCreateClick: () => void
  appearance?: "user" | "admin"
}

export const CreatePost = ({ userAvatar, userName = "User", onCreateClick, appearance = "user" }: CreatePostProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-5 shadow-sm",
        appearance === "admin" ? "border-primary/15 shadow-primary/5" : "border-sand/60 shadow-earth/5",
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className={cn("size-10 border", appearance === "admin" ? "border-primary/20" : "border-sand/40")}>
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className={appearance === "admin" ? "bg-primary/10 text-primary" : "bg-earth/5 text-clay"}>
            {userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Input
          placeholder="Tạo bài viết mới..."
          className={cn(
            "flex-1 cursor-pointer rounded-full",
            appearance === "admin" ? "border-primary/15 bg-primary/[0.03] focus-visible:ring-primary" : "border-sand/60 bg-cream/50",
          )}
          readOnly
          onClick={onCreateClick}
        />
      </div>
    </div>
  )
}
