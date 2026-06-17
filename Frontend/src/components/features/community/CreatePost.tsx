import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"

interface CreatePostProps {
  userAvatar?: string
  userName?: string
  onCreateClick: () => void
}

export const CreatePost = ({ userAvatar, userName = "User", onCreateClick }: CreatePostProps) => {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input placeholder="Tạo bài viết mới..." className="flex-1 cursor-pointer" readOnly onClick={onCreateClick} />
        </div>
      </div>
    </Card>
  )
}
