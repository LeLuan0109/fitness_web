import { useQuery } from "@tanstack/react-query"
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
} from "@tanstack/react-table"
import { Database, Plus, Sparkles } from "lucide-react"
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
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-7 text-primary-foreground shadow-xl shadow-primary/15">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" /> Kho dữ liệu dinh dưỡng
            </div>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
              <Database className="size-7" /> Quản lý nguyên liệu
            </h1>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Duy trì dữ liệu nguyên liệu, đơn vị chuẩn và thông tin dinh dưỡng.
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="gap-2 bg-white text-primary shadow-md hover:bg-white/90"
          >
            <Plus className="size-4" />
            Tạo mới nguyên liệu
          </Button>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-primary/15 bg-card/90 shadow-sm shadow-primary/5 backdrop-blur-sm">
        {isLoading ? (
          <div className="p-4">
            <DataTableSkeleton columnCount={columns.length} rowCount={10} filterCount={1} />
          </div>
        ) : (
          <DataTable table={table}>
            <IngredientSearchForm isFetching={isFetching} />
          </DataTable>
        )}
      </div>

      <IngredientDetailModal
        ingredientId={selectedIngredientId}
        open={isDetailModalOpen}
        onOpenChange={handleCloseDetailModal}
      />
    </div>
  )
}
