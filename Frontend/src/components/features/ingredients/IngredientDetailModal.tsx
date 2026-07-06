import { useQuery } from "@tanstack/react-query"

import { getIngredientById } from "@/api/ingredient.api"
import { CoreformLiftLoader } from "@/components/shared/coreform"
import { coreformDialogContentWideClass } from "@/components/shared/coreform/coreform-modal"
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
      <DialogContent className={coreformDialogContentWideClass}>
        <DialogHeader>
          <DialogTitle>Chi tiết nguyên liệu</DialogTitle>
          <DialogDescription>Thông tin chi tiết về nguyên liệu</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <CoreformLiftLoader label="Đang tải..." />
          </div>
        ) : ingredient ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-24 rounded-2xl border border-sand/60">
                <AvatarImage src={ingredient.image || undefined} alt={ingredient.name} />
                <AvatarFallback className="rounded-2xl bg-cream text-2xl text-earth">
                  {ingredient.name?.charAt(0) || "N"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-display text-2xl font-medium text-earth">{ingredient.name}</h3>
              </div>
            </div>

            <div className="grid gap-4 border-t border-sand/40 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-earth/50">ID</p>
                  <p className="text-base font-medium text-earth">{ingredient.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-earth/50">Đơn vị chuẩn</p>
                  <p className="text-base font-medium text-earth">{ingredient.standardUnitLabel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-earth/50">Calo/Đơn vị</p>
                  <p className="text-base font-medium text-earth">
                    {ingredient.caloriesPerUnit.toFixed(2)} kcal/{ingredient.standardUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-earth/50">Không tìm thấy thông tin nguyên liệu</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
