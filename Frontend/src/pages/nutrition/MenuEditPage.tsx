import { MenuForm } from "@/components/features/nutrition/MenuForm"
import { PageLayout } from "@/layouts/PageLayout"
import { useParams } from "react-router"
import { useGetMenuDetail } from "@/hooks/queries/menus/useGetMenuDetail"
import { useUpdateMenu } from "@/hooks/queries/menus/useUpdateMenu"
import type { MenuRequest } from "@/types/meal.type"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"
import { toast } from "sonner"

export const MenuEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAdmin = authStore.use.auth()?.role?.name === "ADMIN"
  const { data: menuDetail, isLoading } = useGetMenuDetail(id!)
  const { mutate, isPending } = useUpdateMenu(id || "")

  const handleSubmit = (data: MenuRequest) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Cập nhật thực đơn thành công!")
        if (isAdmin) {
          navigate(ROUTES.NUTRITION.SAMPLE)
        } else {
          navigate(ROUTES.NUTRITION.MY_MEALS)
        }
      },
    })
  }

  if (isLoading) {
    return (
      <PageLayout title="Chỉnh sửa thực đơn">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-white" />
          <span className="text-white">Đang tải...</span>
        </div>
      </PageLayout>
    )
  }

  if (!menuDetail) {
    return (
      <PageLayout title="Chỉnh sửa thực đơn">
        <div className="text-center py-8 text-white">Không tìm thấy thực đơn</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Chỉnh sửa thực đơn">
      <MenuForm initialData={menuDetail} onSubmit={handleSubmit} isLoading={isPending} />
    </PageLayout>
  )
}
