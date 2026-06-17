import { IngredientForm } from "@/components/features/ingredients/IngredientForm"
import { PageLayout } from "@/layouts/PageLayout"
import { useParams } from "react-router-dom"
import { useGetIngredientDetail } from "@/hooks/queries/ingredients/useGetIngredientDetail"
import { useUpdateIngredient } from "@/hooks/queries/ingredients/useUpdateIngredient"
import type { IngredientRequest } from "@/types/ingredient.type"
import { Loader2 } from "lucide-react"

export function IngredientEditPage() {
  const { id } = useParams()
  const { data: ingredientData, isLoading } = useGetIngredientDetail(id)
  const { mutate, isPending } = useUpdateIngredient()

  const handleSubmit = (data: IngredientRequest) => {
    if (id) {
      mutate({ id: Number(id), data })
    }
  }

  if (isLoading) {
    return (
      <PageLayout title="Chỉnh sửa nguyên liệu">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span className="text-muted-foreground">Đang tải...</span>
        </div>
      </PageLayout>
    )
  }

  if (!ingredientData) {
    return (
      <PageLayout title="Chỉnh sửa nguyên liệu">
        <div className="text-center py-8 text-muted-foreground">Không tìm thấy nguyên liệu</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Chỉnh sửa nguyên liệu">
      <IngredientForm
        idEdit={id}
        initialData={{
          name: ingredientData.name,
          standardUnit: ingredientData.standardUnit,
          caloriesPerUnit: ingredientData.caloriesPerUnit,
          image: undefined,
        }}
        existingImage={ingredientData.image}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </PageLayout>
  )
}
