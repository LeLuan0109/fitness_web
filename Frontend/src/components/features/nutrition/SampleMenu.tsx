import { Button } from "@/components/shared/ui/button"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { ROUTES } from "@/constants/routes"
import { useGetSampleMenu } from "@/hooks/queries/menus/useGetSampleMenu"
import authStore from "@/stores/auth.store"
import { MenuSearhParams } from "@/types/meal.type"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { MenuCard } from "./MenuCard"
import { MenuSearchForm } from "./MenuSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"

export function SampleMenu() {
  const navigate = useNavigate()
  const isAdmin = authStore.use.auth()?.role?.name === "ADMIN"
  const [searchParams, setSearchParams] = useState<MenuSearhParams>({
    page: 0,
    size: 12,
  })

  const { data: menuResponse, isLoading } = useGetSampleMenu(searchParams)

  const menus = menuResponse?.data ?? []
  const meta = menuResponse?.meta
  const totalPages = meta?.totalPages ?? 0
  const total = meta?.total ?? 0

  const handleViewDetail = (id: number) => {
    navigate(generatePath(ROUTES.NUTRITION.SAMPLE_DETAIL, { id: String(id) }))
  }

  const handleSearch = (params: Omit<MenuSearhParams, "page" | "size">) => {
    setSearchParams({ ...params, page: 0, size: 12 })
  }

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page: page - 1 }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TypographyH3 variant="bold">Thực đơn mẫu</TypographyH3>
        {isAdmin && <Button onClick={() => navigate(ROUTES.NUTRITION.CREATE_MENU)}>Tạo thực đơn mới</Button>}
      </div>
      <MenuSearchForm onSearch={handleSearch} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Loader2 className="animate-spin self-center" />
        ) : menus && menus.length > 0 ? (
          menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onDetailClick={() => handleViewDetail(menu.id)}
              onUpdateClick={() => {}}
              onDeleteClick={() => {}}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground">Không có thực đơn mẫu nào</p>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <CommonPagination
          currentPage={(searchParams.page ?? 0) + 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={searchParams.size ?? 12}
          total={total}
        />
      )}
    </div>
  )
}
