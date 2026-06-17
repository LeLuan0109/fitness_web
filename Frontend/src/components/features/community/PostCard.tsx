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
    <Card className="hover:border-primary/50 transition-all cursor-pointer overflow-hidden p-0 group" onClick={onClick}>
      <div className="p-4">
        {/* Author info */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback>{author?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-1">
            <span className="font-medium text-foreground">u/{author}</span>
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
        <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">{title}</h3>

        {/* Content preview */}
        <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap line-clamp-3">{truncatedContent}</p>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-1.5 hover:bg-accent",
              isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground",
            )}
            onClick={(e) => {
              e.stopPropagation()
              onLike()
            }}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span className="text-xs font-medium">{likes}</span>
          </Button>

          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:bg-accent">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{replies} bình luận</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
