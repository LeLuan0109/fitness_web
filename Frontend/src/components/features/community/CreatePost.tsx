import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Input } from "@/components/shared/ui/input"

interface CreatePostProps {
  userAvatar?: string
  userName?: string
  onCreateClick: () => void
}

export const CreatePost = ({ userAvatar, userName = "User", onCreateClick }: CreatePostProps) => {
  return (
    <div className="rounded-3xl border border-sand/60 bg-card p-5 shadow-sm shadow-earth/5">
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border border-sand/40">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-earth/5 text-clay">{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input
          placeholder="Tạo bài viết mới..."
          className="flex-1 cursor-pointer rounded-full border-sand/60 bg-cream/50"
          readOnly
          onClick={onCreateClick}
        />
      </div>
    </div>
  )
}
