import { useState } from "react"
import { DishesSearchForm } from "./DishesSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { AdminDishCard } from "@/components/features/dishes/AdminDishCard"
import { generatePath, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/shared/ui/button"
import { Plus, Loader2, Utensils } from "lucide-react"
import { useDishesList } from "@/hooks/queries/dishes/useDishesList"
import { DishSearchParams } from "@/types/dish.type"

export function AdminDishesList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<DishSearchParams>({ page: 0, size: 12 })

  const { data, isLoading } = useDishesList(searchParams)

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
    setSearchParams((prev) => ({ ...prev, page: page - 1 }))
  }

  return (
    <div className="w-full space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-7 text-primary-foreground shadow-xl shadow-primary/15">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Utensils className="size-3.5" /> Thư viện dinh dưỡng
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý món ăn</h1>
            <p className="mt-2 text-sm text-primary-foreground/80">Quản lý công thức, nguyên liệu và thông tin dinh dưỡng.</p>
          </div>
          <Button onClick={handleNavigateToCreateDish} className="gap-2 bg-white text-primary shadow-md hover:bg-white/90">
            <Plus className="size-4" /> Thêm món ăn
          </Button>
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <DishesSearchForm onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : dishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Utensils className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Không tìm thấy món ăn</h3>
          <p className="mt-2 text-sm text-slate-500">Hãy thử thay đổi tiêu chí tìm kiếm.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
