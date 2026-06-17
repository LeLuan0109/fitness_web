import { IngredientForm } from "@/components/features/ingredients/IngredientForm"
import { PageLayout } from "@/layouts/PageLayout"
import { useCreateIngredient } from "@/hooks/queries/ingredients/useCreateIngredient"
import type { IngredientRequest } from "@/types/ingredient.type"

export function IngredientCreatePage() {
  const { mutate, isPending } = useCreateIngredient()

  const handleSubmit = (data: IngredientRequest) => {
    mutate(data)
  }

  return (
    <PageLayout title="Tạo mới nguyên liệu">
      <IngredientForm onSubmit={handleSubmit} isLoading={isPending} />
    </PageLayout>
  )
}
