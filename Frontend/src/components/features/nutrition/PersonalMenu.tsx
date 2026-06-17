import { TypographyH3 } from "@/components/shared/ui/typography"
import { MenuSearchForm } from "./MenuSearchForm"
import { MenuCard } from "./MenuCard"
import { generatePath, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { Button } from "@/components/shared/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useGetPersonalMenu } from "@/hooks/queries/menus/useGetPersonalMenu"
import { useDeleteMenu } from "@/hooks/queries/menus/useDeleteMenu"
import { useState } from "react"
import { MenuSearhParams } from "@/types/meal.type"
import { CommonPagination } from "@/components/shared/ui/common-pagination"

export const PersonalMenu = () => {
  const navigate = useNavigate()
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [searchParams, setSearchParams] = useState<MenuSearhParams>({
    page: 0,
    size: 12,
  })

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
    setSearchParams({ ...params, page: 0, size: 12 })
  }

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page: page - 1 }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TypographyH3 variant="bold">Thực đơn của tôi</TypographyH3>
        <Button onClick={handleNavigateToCreate}>
          <Plus />
          Tạo thực đơn mới
        </Button>
      </div>

      <MenuSearchForm onSearch={handleSearch} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : menus && menus.length > 0 ? (
          menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onDetailClick={() => handleViewDetail(menu.id)}
              onUpdateClick={() => handleUpdate(menu.id)}
              onDeleteClick={() => handleDelete(menu.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Không có thực đơn nào</p>
          </div>
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
