import { CoreformEmptyState, CoreformLoadingState } from "@/components/shared/coreform"
import { Button } from "@/components/shared/ui/button"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ROUTES } from "@/constants/routes"
import { useGetSampleMenu } from "@/hooks/queries/menus/useGetSampleMenu"
import type { MenuSearhParams } from "@/types/meal.type"
import { Plus, Sparkles, UtensilsCrossed } from "lucide-react"
import { useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { MenuCard } from "./MenuCard"
import { MenuSearchForm } from "./MenuSearchForm"

export function AdminSampleMenu() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<MenuSearhParams>({ page: 0, size: 12 })
  const { data, isLoading } = useGetSampleMenu(searchParams)

  const menus = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-7 text-primary-foreground shadow-xl shadow-primary/15">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" /> Thư viện dinh dưỡng
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Thực đơn mẫu</h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
              Quản lý thực đơn cân bằng và nội dung dinh dưỡng dành cho người dùng.
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.NUTRITION.CREATE_MENU)}
            className="gap-2 bg-white text-primary shadow-md hover:bg-white/90"
          >
            <Plus className="size-4" /> Tạo thực đơn mới
          </Button>
        </div>
      </section>

      <MenuSearchForm
        appearance="admin"
        onSearch={(params) => setSearchParams({ ...params, page: 0, size: 12 })}
      />

      {isLoading ? (
        <CoreformLoadingState />
      ) : menus.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/[0.03] py-12">
          <CoreformEmptyState icon={UtensilsCrossed} title="Không có thực đơn mẫu nào" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                appearance="admin"
                onDetailClick={() =>
                  navigate(generatePath(ROUTES.NUTRITION.SAMPLE_DETAIL, { id: String(menu.id) }))
                }
              />
            ))}
          </div>

          {(meta?.totalPages ?? 0) > 1 && (
            <CommonPagination
              currentPage={(searchParams.page ?? 0) + 1}
              totalPages={meta?.totalPages ?? 0}
              onPageChange={(page) => setSearchParams((previous) => ({ ...previous, page: page - 1 }))}
              pageSize={searchParams.size ?? 12}
              total={meta?.total ?? 0}
            />
          )}
        </>
      )}
    </div>
  )
}
