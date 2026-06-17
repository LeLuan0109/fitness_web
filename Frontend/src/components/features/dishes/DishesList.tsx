import { useState } from "react"
import { DishesSearchForm } from "./DishesSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { DishCard } from "./DishCard"
import { generatePath, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"
import { Button } from "@/components/shared/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useDishesList } from "@/hooks/queries/dishes/useDishesList"
import { DishSearchParams } from "@/types/dish.type"
import { Card, CardContent } from "@/components/shared/ui/card"

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
      page: 0, // Reset to first page when searching
    }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page - 1, // Convert 1-based to 0-based
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TypographyH3 variant="bold">Danh sách món ăn</TypographyH3>
        {isAdmin && (
          <Button onClick={handleNavigateToCreateDish}>
            <Plus className="w-4 h-4 mr-2" /> Thêm mới món ăn
          </Button>
        )}
      </div>

      <DishesSearchForm onSearch={handleSearch} />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : dishes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Không tìm thấy món ăn nào</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

          <div className="mt-6">
            <CommonPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              total={pagination?.total ?? 0}
              pageSize={searchParams.size}
            />
          </div>
        </>
      )}
    </div>
  )
}
