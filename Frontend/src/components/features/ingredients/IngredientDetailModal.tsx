import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { getIngredientById } from "@/api/ingredient.api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shared/ui/dialog"
import { QUERY_KEYS } from "@/constants/querykeys.constant"

interface IngredientDetailModalProps {
  ingredientId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IngredientDetailModal({ ingredientId, open, onOpenChange }: IngredientDetailModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.INGREDIENTS.DETAIL, ingredientId],
    queryFn: () => getIngredientById(ingredientId!),
    enabled: !!ingredientId && open,
  })

  const ingredient = data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết nguyên liệu</DialogTitle>
          <DialogDescription>Thông tin chi tiết về nguyên liệu</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : ingredient ? (
          <div className="space-y-6">
            {/* Image Section */}
            <div className="flex items-center gap-4">
              <Avatar className="size-24 rounded-lg">
                <AvatarImage src={ingredient.image || undefined} alt={ingredient.name} />
                <AvatarFallback className="rounded-lg text-2xl">{ingredient.name?.charAt(0) || "N"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">{ingredient.name}</h3>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid gap-4 border-t pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-base font-medium">{ingredient.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Đơn vị chuẩn</p>
                  <p className="text-base font-medium">{ingredient.standardUnitLabel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Calo/Đơn vị</p>
                  <p className="text-base font-medium">
                    {ingredient.caloriesPerUnit.toFixed(2)} kcal/{ingredient.standardUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Không tìm thấy thông tin nguyên liệu</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
