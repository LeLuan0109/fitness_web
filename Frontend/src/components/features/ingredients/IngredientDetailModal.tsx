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
      <DialogContent className={`${coreformDialogContentWideClass} border-slate-200 bg-white`}>
        <DialogHeader>
          <DialogTitle className="text-slate-950">Chi tiết nguyên liệu</DialogTitle>
          <DialogDescription className="text-slate-500">Thông tin đơn vị và giá trị năng lượng.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <CoreformLiftLoader label="Đang tải..." />
          </div>
        ) : ingredient ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <Avatar className="size-24 rounded-2xl border border-slate-200 bg-white">
                <AvatarImage src={ingredient.image || undefined} alt={ingredient.name} />
                <AvatarFallback className="rounded-2xl bg-blue-50 text-2xl font-semibold text-blue-700">
                  {ingredient.name?.charAt(0) || "N"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">{ingredient.name}</h3>
              </div>
            </div>

            <div className="grid gap-4 border-t border-slate-200 pt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">ID</p>
                  <p className="text-base font-semibold text-slate-800">{ingredient.id}</p>
                </div>
                <div className="space-y-1 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Đơn vị chuẩn</p>
                  <p className="text-base font-semibold text-slate-800">{ingredient.standardUnitLabel}</p>
                </div>
                <div className="space-y-1 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Calo/Đơn vị</p>
                  <p className="text-base font-semibold text-blue-700">
                    {ingredient.caloriesPerUnit.toFixed(2)} kcal/{ingredient.standardUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500">Không tìm thấy thông tin nguyên liệu</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
