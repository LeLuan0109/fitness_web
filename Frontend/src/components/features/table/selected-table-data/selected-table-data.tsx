import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
} from "@tanstack/react-table"
import { parseAsInteger, useQueryState } from "nuqs"
import * as React from "react"

import { SelectedTableSearchForm } from "@/components/features/table/selected-table-data/selected-table-search-form"
import { DataTable } from "@/components/shared/data-table/data-table"
import { DataTableCell } from "@/components/shared/data-table/data-table-cell"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"
import { Card, CardContent } from "@/components/shared/ui/card"
import { Checkbox } from "@/components/shared/ui/checkbox"
import { PAGINATION_KEY } from "@/constants/common"
import useData from "@/hooks/example/useData"
import type { PrimeContractorTable } from "@/types/example.type"

export function SelectedTableData() {
  const [page, setPage] = useQueryState(PAGINATION_KEY.PAGE, parseAsInteger.withDefault(1))
  const [limit, setLimit] = useQueryState(PAGINATION_KEY.PER_PAGE, parseAsInteger.withDefault(10))
  const { data, isFetching, meta, isLoading } = useData()

  const columns = React.useMemo<ColumnDef<PrimeContractorTable>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
      },
      {
        id: "department",
        accessorKey: "department",
        header: ({ column }: { column: Column<PrimeContractorTable, unknown> }) => (
          <DataTableColumnHeader column={column} title={"table:simpleTable.searchForm.groups"} />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.department} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-1/5 min-w-[150px]",
        },
      },
      {
        id: "role",
        accessorKey: "role",
        header: ({ column }: { column: Column<PrimeContractorTable, unknown> }) => (
          <DataTableColumnHeader column={column} title={"table:simpleTable.searchForm.roles"} />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.role} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-1/5 min-w-[150px]",
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }: { column: Column<PrimeContractorTable, unknown> }) => (
          <DataTableColumnHeader column={column} title={"table:simpleTable.searchForm.name"} />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.name} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-1/5 min-w-[150px]",
        },
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }: { column: Column<PrimeContractorTable, unknown> }) => (
          <DataTableColumnHeader column={column} title={"table:simpleTable.searchForm.email"} />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.email} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-1/5 min-w-[150px]",
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<PrimeContractorTable, unknown> }) => (
          <DataTableColumnHeader column={column} title={"table:simpleTable.searchForm.createdAt"} />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-1/5 min-w-[150px]",
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<PrimeContractorTable, unknown> }) => (
          <DataTableColumnHeader column={column} title={"table:simpleTable.searchForm.status"} />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-1/5 min-w-[150px]",
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    data,
    columns,
    pageCount: meta?.totalPages ?? 1,
    onPaginationChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(table.getState().pagination)
        setPage(newPagination.pageIndex + 1)
        setLimit(newPagination.pageSize)
      } else {
        setPage(updaterOrValue.pageIndex + 1)
        setLimit(updaterOrValue.pageSize)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
  })

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <DataTableSkeleton columnCount={columns.length} rowCount={10} filterCount={5} />
        ) : (
          <DataTable table={table} isSelectedTable>
            <SelectedTableSearchForm isFetching={isFetching} />
          </DataTable>
        )}
      </CardContent>
    </Card>
  )
}
