import { ImageWithFallback } from "@/components/shared/common/image-with-fallbacks"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeleteDish } from "@/hooks/queries/dishes/useDeleteDish"
import { useDishDetail } from "@/hooks/queries/dishes/useDishDetail"
import { ArrowLeft, Clock3, Edit, Loader2, Salad, Trash } from "lucide-react"
import { generatePath, useNavigate, useParams } from "react-router"

export function AdminDishDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useDishDetail(id)
  const deleteMutation = useDeleteDish()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Không tìm thấy thông tin món ăn</p>
          <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 size-4" /> Quay lại
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleDelete = () => {
    if (!id) return
    deleteMutation.mutate(id, {
      onSuccess: () => navigate(ROUTES.DISHES.LIST),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" className="self-start text-slate-600 hover:bg-slate-100" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Quay lại
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            onClick={() => navigate(generatePath(ROUTES.DISHES.EDIT, { id }))}
          >
            <Edit className="size-4" /> Chỉnh sửa món ăn
          </Button>
          <Button variant="destructive" className="gap-2" onClick={onOpen}>
            <Trash className="size-4" /> Xóa
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          <Salad className="size-3.5" /> Thông tin món ăn
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{data.name}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <Clock3 className="size-4" /> {data.cookingTime} phút chuẩn bị
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm lg:col-span-2">
          <div className="relative min-h-[360px] sm:min-h-[480px]">
            <ImageWithFallback src={data.image} alt={data.name} className="absolute inset-0 size-full object-cover" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-3 p-5">
              <h2 className="text-base font-semibold text-slate-900">Giá trị dinh dưỡng</h2>
              {[
                ["Calories", data.calories],
                ["Protein", `${data.protein}g`],
                ["Carbs", `${data.carbs}g`],
                ["Fat", `${data.fat}g`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                  <span className="text-sm text-slate-500">{label}</span>
                  <strong className="text-sm text-slate-800">{value}</strong>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Nguyên liệu</h2>
              <div className="space-y-3">
                {data.ingredients.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium text-slate-800">{item.ingredient.name}</span>
                      <span className="text-sm text-slate-500">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    {item.preparationNote && (
                      <p className="mt-1 text-xs text-slate-500">{item.preparationNote}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Cách chế biến</h2>
          <div className="space-y-3 text-slate-700">
            {String(data.preparation)
              .split(/\n|\r\n/)
              .map((step) => step.trim())
              .filter(Boolean)
              .map((step, index) => (
                <div key={index} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6">{step}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={onOpenChange}
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
