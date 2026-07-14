import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { TypographyH5 } from "@/components/shared/ui/typography"
import { FITNESS_GOAL_OPTIONS, MEAL_NAME_LABELS } from "@/constants/common"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeleteMenu } from "@/hooks/queries/menus/useDeleteMenu"
import { useGetMenuDetail } from "@/hooks/queries/menus/useGetMenuDetail"
import { Beef, Droplet, Flame, Loader2, Wheat } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { MacroCard } from "./MacroCard"
import { MealBreakdown } from "./MealBreakdown"
import { MealDetailHeader } from "./MenuDetailHeader"
import { useCopyMenu } from "@/hooks/queries/menus/useCopyMenu"
import { toast } from "sonner"
import authStore from "@/stores/auth.store"
import { MealType } from "@/types/enum"

type MenuDetailProps = {
  isSample?: boolean
}

export const MenuDetail = ({ isSample: isSampleRoute }: MenuDetailProps = {}) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const isAdmin = authStore.use.auth()?.role?.name === "ADMIN"
  const listRoute = isSampleRoute ? ROUTES.NUTRITION.SAMPLE : ROUTES.NUTRITION.MY_MEALS

  const { data: menu, isLoading } = useGetMenuDetail(id)
  const { mutate: deleteMenu } = useDeleteMenu()
  const { mutate: copyMenu } = useCopyMenu()

  const handleUseMenu = () => {
    if (!isAdmin) {
      copyMenu(id, {
        onSuccess: () => {
          toast.success("Sao chép thực đơn thành công")
          navigate(ROUTES.NUTRITION.MY_MEALS)
        },
      })
    }
  }

  const handleEdit = () => {
    navigate(ROUTES.NUTRITION.EDIT_MENU.replace(":id", id!))
  }

  const handleDelete = () => {
    onOpen()
  }

  const handleConfirmDelete = () => {
    if (id) {
      deleteMenu(id, {
        onSuccess: () => {
          onOpenChange(false)
          navigate(listRoute)
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Không tìm thấy thực đơn</p>
      </div>
    )
  }

  const fitnessGoalLabel = FITNESS_GOAL_OPTIONS.find((opt) => opt.value === menu.fitnessGoal)?.label || ""
  const isSample = menu.isDefault

  // Sắp xếp các bữa ăn theo thứ tự: Bữa sáng → Bữa trưa → Bữa tối → Bữa phụ
  const mealOrder = {
    [MealType.BREAKFAST]: 1,
    [MealType.LUNCH]: 2,
    [MealType.DINNER]: 3,
    [MealType.EXTRA]: 4,
  }

  const sortedMeals = [...menu.meals].sort((a, b) => {
    const orderA = mealOrder[a.mealType] || 999
    const orderB = mealOrder[b.mealType] || 999
    return orderA - orderB
  })

  return (
    <>
      <div className="space-y-4">
        <MealDetailHeader
          title={menu.name}
          tags={[fitnessGoalLabel]}
          onUseMenu={handleUseMenu}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isSample={isSample}
        />

        {menu.description && <TypographyH5>{menu.description}</TypographyH5>}

        <div className="flex items-center gap-4 flex-wrap">
          <MacroCard label="Calories" value={menu.calories.toFixed(0)} Icon={Flame} />
          <MacroCard label="Protein" value={`${menu.protein.toFixed(1)}g`} Icon={Beef} />
          <MacroCard label="Carbs" value={`${menu.carbs.toFixed(1)}g`} Icon={Wheat} />
          <MacroCard label="Fat" value={`${menu.fat.toFixed(1)}g`} Icon={Droplet} />
        </div>

        <div className="space-y-6 mt-4">
          {sortedMeals.map((meal) => (
            <MealBreakdown key={meal.id} meal={meal} mealName={MEAL_NAME_LABELS[meal?.name] || meal.name} />
          ))}
        </div>
      </div>
      <ConfirmDialog
        variant="destructive"
        open={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleConfirmDelete}
        title="Xóa thực đơn"
        content="Bạn có chắc chắn muốn xóa thực đơn này? Hành động này không thể hoàn tác."
      />
    </>
  )
}
