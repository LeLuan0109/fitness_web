import { useQuery } from "@tanstack/react-query"
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
} from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"
import { useNavigate } from "react-router-dom"

import { getAllIngredients } from "@/api/ingredient.api"
import { IngredientActions } from "@/components/features/ingredients/IngredientActions"
import { IngredientDetailModal } from "@/components/features/ingredients/IngredientDetailModal"
import { IngredientSearchForm } from "@/components/features/ingredients/IngredientSearchForm"
import { DataTable } from "@/components/shared/data-table/data-table"
import { DataTableCell } from "@/components/shared/data-table/data-table-cell"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { PAGINATION_KEY } from "@/constants/common"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import type { IngredientDetailResponse } from "@/types/ingredient.type"

export function IngredientList() {
  const navigate = useNavigate()
  const [page, setPage] = useQueryState(PAGINATION_KEY.PAGE, parseAsInteger.withDefault(1))
  const [size, setSize] = useQueryState(PAGINATION_KEY.PER_PAGE, parseAsInteger.withDefault(10))
  const [search] = useQueryState("search", parseAsString.withDefault(""))

  const [selectedIngredientId, setSelectedIngredientId] = React.useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.INGREDIENTS.LIST, { search, page, size }],
    queryFn: () =>
      getAllIngredients({
        search,
        page: page - 1,
        size,
      }),
  })

  const ingredients = data?.data || []
  const meta = data?.meta

  const handleViewDetail = React.useCallback((id: number) => {
    setSelectedIngredientId(id)
    setIsDetailModalOpen(true)
  }, [])

  const handleCloseDetailModal = React.useCallback(() => {
    setIsDetailModalOpen(false)
    setSelectedIngredientId(null)
  }, [])

  const columns = React.useMemo<ColumnDef<IngredientDetailResponse>[]>(
    () => [
      {
        id: "stt",
        header: ({ column }: { column: Column<IngredientDetailResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="STT" />
        ),
        cell: ({ row }) => {
          const index = row.index + 1 + (page - 1) * size
          return <DataTableCell value={index.toString()} />
        },
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[80px]",
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }: { column: Column<IngredientDetailResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Tên nguyên liệu" />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.name} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[200px]",
        },
      },
      {
        id: "standardUnitLabel",
        accessorKey: "standardUnitLabel",
        header: ({ column }: { column: Column<IngredientDetailResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Đơn vị chuẩn" />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.standardUnitLabel} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[150px]",
        },
      },
      {
        id: "caloriesPerUnit",
        accessorKey: "caloriesPerUnit",
        header: ({ column }: { column: Column<IngredientDetailResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Calo/Đơn vị" />
        ),
        cell: ({ row }) => (
          <DataTableCell value={`${row.original.caloriesPerUnit.toFixed(2)} kcal/${row.original.standardUnit}`} />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[150px]",
        },
      },
      {
        id: "actions",
        header: ({ column }: { column: Column<IngredientDetailResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Hành động" />
        ),
        cell: ({ row }) => <IngredientActions ingredient={row.original} onViewDetail={handleViewDetail} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[120px]",
        },
      },
    ],
    [handleViewDetail, page, size],
  )

  const table = useReactTable({
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
    },
    data: ingredients,
    columns,
    pageCount: meta?.totalPages ?? 1,
    onPaginationChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(table.getState().pagination)
        setPage(newPagination.pageIndex + 1)
        setSize(newPagination.pageSize)
      } else {
        setPage(updaterOrValue.pageIndex + 1)
        setSize(updaterOrValue.pageSize)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id.toString(),
    manualPagination: true,
  })

  const handleCreateNew = () => {
    navigate("/ingredients/create")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-earth">Quản lý nguyên liệu</h2>
        <Button onClick={handleCreateNew} className="bg-clay hover:bg-earth text-cream gap-2">
          <Plus className="mr-2 size-4" />
          Tạo mới nguyên liệu
        </Button>
      </div>
      <Card className="">
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton columnCount={columns.length} rowCount={10} filterCount={1} />
          ) : (
            <DataTable table={table}>
              <IngredientSearchForm isFetching={isFetching} />
            </DataTable>
          )}
        </CardContent>
      </Card>

      <IngredientDetailModal
        ingredientId={selectedIngredientId}
        open={isDetailModalOpen}
        onOpenChange={handleCloseDetailModal}
      />
    </div>
  )
}
