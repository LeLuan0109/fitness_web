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
  appearance?: "user" | "admin"
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
  appearance = "user",
}: PostCardProps) => {
  // Truncate content for preview
  const truncatedContent = content.length > 200 ? content.substring(0, 200) + "..." : content

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl bg-card p-0 shadow-sm transition-all hover:shadow-md",
        appearance === "admin"
          ? "border-primary/15 shadow-primary/5 hover:border-primary/45"
          : "border-sand/60 shadow-earth/5 hover:border-clay/40",
      )}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Avatar className={cn("size-7 border", appearance === "admin" ? "border-primary/20" : "border-sand/40")}>
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className={cn("text-xs", appearance === "admin" ? "bg-primary/10 text-primary" : "bg-earth/5 text-clay")}>{author?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-1 items-center gap-1 text-xs", appearance === "admin" ? "text-muted-foreground" : "text-earth/50")}>
            <span className={cn("font-medium", appearance === "admin" ? "text-foreground" : "text-earth")}>u/{author}</span>
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
        <h3 className={cn("font-display mb-2 text-lg font-medium transition-colors", appearance === "admin" ? "text-foreground group-hover:text-primary" : "text-earth group-hover:text-clay")}>{title}</h3>

        <p className={cn("mb-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed", appearance === "admin" ? "text-muted-foreground" : "text-earth/65")}>{truncatedContent}</p>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-1.5 rounded-full",
              appearance === "admin" && "hover:bg-primary/10",
              appearance === "user" && "hover:bg-sand-light/60",
              isLiked
                ? appearance === "admin"
                  ? "text-primary"
                  : "text-[#B35F4A] hover:text-[#9C4433]"
                : appearance === "admin"
                  ? "text-muted-foreground"
                  : "text-earth/50",
            )}
            onClick={(e) => {
              e.stopPropagation()
              onLike()
            }}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span className="text-xs font-medium">{likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-1.5 rounded-full",
              appearance === "admin"
                ? "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                : "text-earth/50 hover:bg-sand-light/60",
            )}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{replies} bình luận</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
