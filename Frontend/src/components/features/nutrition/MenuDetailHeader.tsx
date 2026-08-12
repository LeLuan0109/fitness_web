import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { TypographyH3 } from "@/components/shared/ui/typography"
import authStore from "@/stores/auth.store"
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"

interface MealDetailHeaderProps {
  title: string
  status?: "in-use" | "inactive"
  tags?: string[]
  onUseMenu?: () => void
  onEdit?: () => void
  onDelete?: () => void
  isSample?: boolean
}

export const MealDetailHeader = ({
  title,
  tags = [],
  onUseMenu,
  onEdit,
  onDelete,
  isSample = true,
}: MealDetailHeaderProps) => {
  const navigate = useNavigate()
  const isAdmin = authStore.use.auth()?.role?.name === "ADMIN"

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0 hover:bg-sand-light/60"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <TypographyH3 className="text-earth font-bold leading-tight">{title}</TypographyH3>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                title={tag}
                className={`text-xs font-medium px-2 py-1 rounded-full ${index === 0 ? "ml-0" : "ml-1"
                  } border border-sand/60 bg-cream/70 text-clay hover:bg-sand-light/60`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSample && !isAdmin && onUseMenu && (
          <Button onClick={onUseMenu}>
            <Plus />
            Sao chép
          </Button>
        )}

        {isSample && isAdmin && (
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

        {/* Show Edit and Delete buttons if it's NOT a sample menu (personal menu) */}
        {!isSample && (
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
