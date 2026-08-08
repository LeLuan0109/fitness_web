import { MenuForm } from "@/components/features/nutrition/MenuForm"
import { PageLayout } from "@/layouts/PageLayout"
import { useCreateMenu } from "@/hooks/queries/menus/useCreateMenu"
import type { MenuRequest } from "@/types/meal.type"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { toast } from "sonner"

type MenuCreatePageProps = {
  audience?: "admin" | "user"
}

export const MenuCreatePage = ({ audience = "user" }: MenuCreatePageProps) => {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateMenu()

  const handleSubmit = (data: MenuRequest) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Tạo thực đơn thành công!")
        if (audience === "admin") {
          navigate(ROUTES.NUTRITION.SAMPLE)
        } else {
          navigate(ROUTES.NUTRITION.MY_MEALS)
        }
      },
    })
  }

  return (
    <PageLayout title="Tạo thực đơn">
      <MenuForm onSubmit={handleSubmit} isLoading={isPending} />
    </PageLayout>
  )
}
