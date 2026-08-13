import {
  CoreformEmptyState,
  CoreformLoadingState,
  CoreformPageHeader,
  CoreformPrimaryButton,
} from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeleteMenu } from "@/hooks/queries/menus/useDeleteMenu"
import { useGetPersonalMenu } from "@/hooks/queries/menus/useGetPersonalMenu"
import { MenuSearhParams } from "@/types/meal.type"
import { Plus, UtensilsCrossed } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { MenuCard } from "./MenuCard"
import { MenuSearchForm } from "./MenuSearchForm"

export const PersonalMenu = () => {
  const navigate = useNavigate()
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [filters, setFilters] = useState<Omit<MenuSearhParams, "page">>({
    size: 12,
  })
  const searchParams: MenuSearhParams = { ...filters, page: page - 1 }

  const { data: menuResponse, isLoading } = useGetPersonalMenu(searchParams)
  const { mutate: deleteMenu } = useDeleteMenu()

  const menus = menuResponse?.data ?? []
  const meta = menuResponse?.meta
  const totalPages = meta?.totalPages ?? 0
  const total = meta?.total ?? 0

  const handleViewDetail = (id: number) => {
    navigate(generatePath(ROUTES.NUTRITION.MY_MEALS_DETAIL, { id: String(id) }))
  }

  const handleNavigateToCreate = () => {
    navigate(ROUTES.NUTRITION.CREATE_MENU)
  }

  const handleUpdate = (id: number) => {
    navigate(generatePath(ROUTES.NUTRITION.EDIT_MENU, { id: String(id) }))
  }

  const handleDelete = (id: number) => {
    setSelectedMenuId(id)
    onOpen()
  }

  const handleConfirmDelete = () => {
    if (selectedMenuId) {
      deleteMenu(selectedMenuId, {
        onSuccess: () => {
          onOpenChange(false)
          setSelectedMenuId(null)
        },
      })
    }
  }

  const handleSearch = (params: Omit<MenuSearhParams, "page" | "size">) => {
    setFilters((prev) => ({ ...prev, ...params }))
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="space-y-8">
      <CoreformPageHeader
        title="Thực đơn của tôi"
        description="Quản lý thực đơn cá nhân và theo dõi dinh dưỡng hàng ngày."
        action={
          <CoreformPrimaryButton onClick={handleNavigateToCreate}>
            <Plus className="size-4" />
            Tạo thực đơn mới
          </CoreformPrimaryButton>
        }
      />

      <MenuSearchForm onSearch={handleSearch} />

      {isLoading ? (
        <CoreformLoadingState />
      ) : menus.length === 0 ? (
        <CoreformEmptyState
          icon={UtensilsCrossed}
          title="Không có thực đơn nào"
          description="Bạn chưa tạo thực đơn nào. Bắt đầu với một kế hoạch dinh dưỡng mới."
          action={
            <CoreformPrimaryButton onClick={handleNavigateToCreate}>
              <Plus className="size-4" />
              Tạo thực đơn đầu tiên
            </CoreformPrimaryButton>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onDetailClick={() => handleViewDetail(menu.id)}
                onUpdateClick={() => handleUpdate(menu.id)}
                onDeleteClick={() => handleDelete(menu.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <CommonPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={searchParams.size ?? 12}
              total={total}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleConfirmDelete}
        variant="destructive"
        title="Xóa thực đơn"
        content="Bạn có chắc chắn muốn xóa thực đơn này? Hành động này không thể hoàn tác."
      />
    </div>
  )
}
