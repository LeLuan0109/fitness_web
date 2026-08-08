import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { CoreformEmptyState, CoreformLoadingState, CoreformPageHeader } from "@/components/shared/coreform"
import { ROUTES } from "@/constants/routes"
import { useDishesList } from "@/hooks/queries/dishes/useDishesList"
import { DishSearchParams } from "@/types/dish.type"
import { Soup } from "lucide-react"
import { useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { DishCard } from "./DishCard"
import { DishesSearchForm } from "./DishesSearchForm"

export function UserDishesList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<DishSearchParams>({ page: 0, size: 12 })
  const { data, isLoading } = useDishesList(searchParams)

  const dishes = data?.data ?? []
  const pagination = data?.pagination
  const currentPage = (searchParams.page ?? 0) + 1
  const totalPages = pagination?.totalPages ?? 1

  const handleSearch = (query: { name?: string; cookingTime?: number }) => {
    setSearchParams((previous) => ({
      ...previous,
      search: query.name,
      cookingTime: query.cookingTime,
      page: 0,
    }))
  }

  return (
    <div className="space-y-8 text-earth">
      <div className="rounded-3xl border border-sand/60 bg-cream/50 p-6 shadow-sm shadow-earth/5">
        <CoreformPageHeader
          title="Danh sách món ăn"
          description="Khám phá món ăn và thông tin dinh dưỡng chi tiết."
        />
      </div>

      <div className="rounded-2xl border border-sand/60 bg-white p-4 shadow-sm shadow-earth/5">
        <DishesSearchForm onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <CoreformLoadingState />
      ) : dishes.length === 0 ? (
        <div className="rounded-2xl border border-sand/60 bg-white p-10 text-earth">
          <CoreformEmptyState icon={Soup} title="Không tìm thấy món ăn nào" />
        </div>
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
                onClick={() => navigate(generatePath(ROUTES.DISHES.DETAIL, { id: dish.id.toString() }))}
              />
            ))}
          </div>
          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setSearchParams((previous) => ({ ...previous, page: page - 1 }))}
            total={pagination?.total ?? 0}
            pageSize={searchParams.size}
            className="mt-6"
          />
        </>
      )}
    </div>
  )
}
