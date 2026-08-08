import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { Edit, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MealDetailHeaderProps {
  title: string
  status?: "in-use" | "inactive"
  tags?: string[]
  onUseMenu?: () => void
  onEdit?: () => void
  onDelete?: () => void
  isSample?: boolean
  actions?: "copy" | "manage" | "personal"
  appearance?: "user" | "admin"
}

export const MealDetailHeader = ({
  title,
  tags = [],
  onUseMenu,
  onEdit,
  onDelete,
  isSample = true,
  actions = isSample ? "copy" : "personal",
  appearance = "user",
}: MealDetailHeaderProps) => {
  const isAdmin = appearance === "admin"

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <TypographyH3 className={cn("font-bold leading-tight", isAdmin ? "text-foreground" : "text-earth")}>{title}</TypographyH3>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                title={tag}
                className={cn(
                  "rounded-full border px-2 py-1 text-xs font-medium",
                  index === 0 ? "ml-0" : "ml-1",
                  isAdmin ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15" : "border-sand/60 bg-cream/70 text-clay hover:bg-sand-light/60",
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions === "copy" && onUseMenu && (
          <Button onClick={onUseMenu}>
            <Plus />
            Sao chép
          </Button>
        )}

        {actions === "manage" && (
          <>
            {onEdit && (
              <Button onClick={onEdit} variant="secondary">
                <Edit />
                Chỉnh sửa
              </Button>
            )}
            {onDelete && (
              <Button onClick={onDelete} variant="destructive">
                <Trash2 />
                Xóa
              </Button>
            )}
          </>
        )}

        {actions === "personal" && (
          <>
            {onEdit && (
              <Button onClick={onEdit} variant="secondary">
                <Edit />
                Chỉnh sửa
              </Button>
            )}
            {onDelete && (
              <Button onClick={onDelete} variant="destructive">
                <Trash2 />
                Xóa
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
