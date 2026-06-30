import { Card, CardContent } from "@/components/shared/ui/card"
import { MacroCard } from "@/components/features/nutrition/MacroCard"
import { Flame, Beef, Wheat, Droplet, Loader2, ArrowLeft, Edit, Trash } from "lucide-react"
import { IngredientItem } from "./IngredientItem"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { useParams, useNavigate, generatePath } from "react-router"
import { useDishDetail } from "@/hooks/queries/dishes/useDishDetail"
import { Button } from "@/components/shared/ui/button"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { useDeleteDish } from "@/hooks/queries/dishes/useDeleteDish"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"

export function DishDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useDishDetail(id)
  const { isOpen: isOpenDeleteDialog, onOpenChange: onOpenDeleteDialogChange } = useDisclosure()
  const deleteMutation = useDeleteDish()
  const isAdmin = authStore.use.auth()?.role?.name === "ADMIN"

  const handleEdit = () => {
    if (id) {
      navigate(generatePath(ROUTES.DISHES.EDIT, { id }))
    }
  }

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          navigate(ROUTES.DISHES.LIST)
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Không tìm thấy thông tin món ăn</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button onClick={handleEdit}>
              <Edit />
              Chỉnh sửa món ăn
            </Button>
            <Button variant="destructive" onClick={() => onOpenDeleteDialogChange(true)}>
              <Trash /> Xóa
            </Button>
          </div>
        )}
      </div>
      <TypographyH3 variant="bold">Chi tiết món ăn</TypographyH3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl overflow-hidden h-full p-0">
            <div className="relative h-full min-h-[500px]">
              <img src={data.image} alt={data.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-2xl font-bold text-white">{data.name}</h1>
                <div className="text-white/80 mt-2">{data.cookingTime} phút</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-xl">
            <CardContent>
              <h3 className="text-foreground font-semibold mb-4">Giá trị dinh dưỡng</h3>
              <div className="flex gap-3 flex-wrap">
                <MacroCard label="Calories" value={`${data.calories}`} Icon={Flame} />
                <MacroCard label="Protein" value={`${data.protein}g`} Icon={Beef} />
                <MacroCard label="Carbs" value={`${data.carbs}g`} Icon={Wheat} />
                <MacroCard label="Fat" value={`${data.fat}g`} Icon={Droplet} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent>
              <h3 className="text-foreground font-semibold mb-4">Nguyên liệu</h3>
              <div className="space-y-3">
                {data.ingredients.map((ing: any) => (
                  <IngredientItem key={ing.id} item={ing} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-xl">
        <CardContent>
          <h3 className="text-foreground font-semibold mb-4">Cách chế biến</h3>
          <div className="space-y-3">
            {/* Try to split recipe into steps if possible */}
            {String(data.preparation)
              .split(/\n|\r\n/)
              .map((s) => s.trim())
              .filter(Boolean)
              .map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="text-foreground/90">{step}</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isOpenDeleteDialog}
        onOpenChange={onOpenDeleteDialogChange}
        title="Xác nhận xóa món ăn"
        content={`Bạn có chắc chắn muốn xóa món ăn "${data.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Xóa món ăn"
        cancelText="Hủy"
      />
    </div>
  )
}
