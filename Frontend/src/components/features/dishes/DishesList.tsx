import { useState } from "react"
import { DishesSearchForm } from "./DishesSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import {
  CoreformEmptyState,
  CoreformLoadingState,
  CoreformPageHeader,
  CoreformPrimaryButton,
} from "@/components/shared/coreform"
import { DishCard } from "./DishCard"
import { generatePath, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"
import { Plus, Soup } from "lucide-react"
import { useDishesList } from "@/hooks/queries/dishes/useDishesList"
import { DishSearchParams } from "@/types/dish.type"

export function DishesList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<DishSearchParams>({
    page: 0,
    size: 12,
  })

  const { data, isLoading } = useDishesList(searchParams)
  const isAdmin = authStore.use.auth()?.role?.name === "ADMIN"

  const dishes = data?.data ?? []
  const pagination = data?.pagination
  const currentPage = (searchParams.page ?? 0) + 1
  const totalPages = pagination?.totalPages ?? 1

  const handleNavigateToDishDetail = (dishId: number) => {
    navigate(generatePath(ROUTES.DISHES.DETAIL, { id: dishId.toString() }))
  }

  const handleNavigateToCreateDish = () => {
    navigate(ROUTES.DISHES.CREATE)
  }

  const handleSearch = (query: { name?: string; cookingTime?: number }) => {
    setSearchParams((prev) => ({
      ...prev,
      search: query.name,
      cookingTime: query.cookingTime,
      page: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page - 1,
    }))
  }

  return (
    <div className="space-y-8">
      <CoreformPageHeader
        title="Danh sách món ăn"
        description="Khám phá món ăn và thông tin dinh dưỡng chi tiết."
        action={
          isAdmin ? (
            <CoreformPrimaryButton onClick={handleNavigateToCreateDish}>
              <Plus className="size-4" /> Thêm món ăn
            </CoreformPrimaryButton>
          ) : undefined
        }
      />

      <DishesSearchForm onSearch={handleSearch} />

      {isLoading ? (
        <CoreformLoadingState />
      ) : dishes.length === 0 ? (
        <CoreformEmptyState icon={Soup} title="Không tìm thấy món ăn nào" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={{
                  id: dish.id,
                  title: dish.name,
                  image: dish.image,
                  calories: dish.calories,
                  protein: dish.protein,
                  carbs: dish.carbs,
                  fat: dish.fat,
                  cookTime: `${dish.cookingTime} phút`,
                }}
                onClick={() => handleNavigateToDishDetail(dish.id)}
              />
            ))}
          </div>

          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            total={pagination?.total ?? 0}
            pageSize={searchParams.size}
            className="mt-6"
          />
        </>
      )}
    </div>
  )
}
