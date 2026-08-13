import { parseAsInteger, useQueryState } from "nuqs"
import { useState } from "react"
import { DishesSearchForm } from "./DishesSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { AdminDishCard } from "@/components/features/dishes/AdminDishCard"
import { generatePath, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/shared/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useDishesList } from "@/hooks/queries/dishes/useDishesList"
import { DishSearchParams } from "@/types/dish.type"

export function AdminDishesList() {
  const navigate = useNavigate()
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [filters, setFilters] = useState<Omit<DishSearchParams, "page">>({ size: 12 })
  const searchParams: DishSearchParams = { ...filters, page: page - 1 }

  const { data, isLoading } = useDishesList(searchParams)

  const dishes = data?.data ?? []
  const pagination = data?.pagination
  const currentPage = page
  const totalPages = pagination?.totalPages ?? 1

  const handleNavigateToDishDetail = (dishId: number) => {
    navigate(generatePath(ROUTES.DISHES.DETAIL, { id: dishId.toString() }))
  }

  const handleNavigateToCreateDish = () => {
    navigate(ROUTES.DISHES.CREATE)
  }

  const handleSearch = (query: { name?: string; cookingTime?: number }) => {
    setFilters((prev) => ({
      ...prev,
      search: query.name,
      cookingTime: query.cookingTime,
    }))
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Danh sách món ăn</h1>
          <p className="mt-2 text-sm text-muted-foreground">Khám phá món ăn và thông tin dinh dưỡng chi tiết.</p>
        </div>
        <Button onClick={handleNavigateToCreateDish} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="size-4" /> Thêm món ăn
        </Button>
      </div>

      <DishesSearchForm onSearch={handleSearch} />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : dishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center backdrop-blur-sm">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-primary">
            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Không tìm thấy món ăn nào</h3>
          <p className="mt-2 text-sm text-muted-foreground">Vui lòng thay đổi tiêu chí tìm kiếm.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {dishes.map((dish) => (
              <AdminDishCard
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
