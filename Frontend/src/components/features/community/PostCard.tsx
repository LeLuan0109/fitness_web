import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Button } from "@/components/shared/ui/button"
import { Card } from "@/components/shared/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shared/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Heart, MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react"

interface PostCardProps {
  id: string
  title: string
  author: string
  authorAvatar: string
  content: string
  replies: number
  likes: number
  isLiked: boolean
  createdAt: Date
  canEdit?: boolean
  canDelete?: boolean
  onLike: () => void
  onClick: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const PostCard = ({
  title,
  author,
  authorAvatar,
  content,
  replies,
  likes,
  isLiked,
  createdAt,
  canEdit,
  canDelete,
  onLike,
  onClick,
  onEdit,
  onDelete,
}: PostCardProps) => {
  // Truncate content for preview
  const truncatedContent = content.length > 200 ? content.substring(0, 200) + "..." : content

  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-2xl border-sand/60 bg-white p-0 shadow-sm shadow-earth/5 transition-all hover:border-clay/40 hover:shadow-md"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Avatar className="size-7 border border-sand/40">
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className="bg-earth/5 text-xs text-clay">{author?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center gap-1 text-xs text-earth/50">
            <span className="font-medium text-earth">u/{author}</span>
            <span>•</span>
            <span>{formatDistanceToNow(createdAt, { addSuffix: true, locale: vi })}</span>
          </div>

          {/* Actions Menu */}
          {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.()
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.()
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display mb-2 text-lg font-medium text-earth transition-colors group-hover:text-clay">{title}</h3>

        <p className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-earth/65">{truncatedContent}</p>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-1.5 rounded-full hover:bg-sand-light/60",
              isLiked ? "text-[#B35F4A] hover:text-[#9C4433]" : "text-earth/50",
            )}
            onClick={(e) => {
              e.stopPropagation()
              onLike()
            }}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span className="text-xs font-medium">{likes}</span>
          </Button>

          <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-full text-earth/50 hover:bg-sand-light/60">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{replies} bình luận</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
