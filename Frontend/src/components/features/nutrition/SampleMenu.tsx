import {
  CoreformEmptyState,
  CoreformLoadingState,
  CoreformPageHeader,
  CoreformPrimaryButton,
} from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ROUTES } from "@/constants/routes"
import { useGetSampleMenu } from "@/hooks/queries/menus/useGetSampleMenu"
import authStore from "@/stores/auth.store"
import { MenuSearhParams } from "@/types/meal.type"
import { UtensilsCrossed } from "lucide-react"
import { useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { MenuCard } from "./MenuCard"
import { MenuSearchForm } from "./MenuSearchForm"

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
    <div className="space-y-8">
      <CoreformPageHeader
        title="Thực đơn mẫu"
        description="Khám phá thực đơn cân bằng được thiết kế cho từng mục tiêu dinh dưỡng."
        action={
          isAdmin ? (
            <CoreformPrimaryButton onClick={() => navigate(ROUTES.NUTRITION.CREATE_MENU)}>
              Tạo thực đơn mới
            </CoreformPrimaryButton>
          ) : undefined
        }
      />

      <MenuSearchForm onSearch={handleSearch} />

      {isLoading ? (
        <CoreformLoadingState />
      ) : menus.length === 0 ? (
        <CoreformEmptyState icon={UtensilsCrossed} title="Không có thực đơn mẫu nào" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onDetailClick={() => handleViewDetail(menu.id)}
                onUpdateClick={() => {}}
                onDeleteClick={() => {}}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <CommonPagination
              currentPage={(searchParams.page ?? 0) + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={searchParams.size ?? 12}
              total={total}
            />
          )}
        </>
      )}
    </div>
  )
}
