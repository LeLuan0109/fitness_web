import { Eye, Pencil } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/shared/ui/button"
import type { IngredientDetailResponse } from "@/types/ingredient.type"
import { ROUTES } from "@/constants/routes"

interface IngredientActionsProps {
  ingredient: IngredientDetailResponse
  onViewDetail: (id: number) => void
}

export function IngredientActions({ ingredient, onViewDetail }: IngredientActionsProps) {
  const navigate = useNavigate()

  const handleView = () => {
    onViewDetail(ingredient.id)
  }

  const handleEdit = () => {
    navigate(ROUTES.INGREDIENTS.EDIT.replace(":id", ingredient.id.toString()))
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-blue-50 hover:text-blue-700" onClick={handleView} title="Xem chi tiết">
        <Eye className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-blue-50 hover:text-blue-700" onClick={handleEdit} title="Chỉnh sửa">
        <Pencil className="size-4" />
      </Button>
    </div>
  )
}
