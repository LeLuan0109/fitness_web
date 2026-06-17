import { useQuery } from "@tanstack/react-query"
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { getAllUsers } from "@/api/user.api"
import { UserActions } from "@/components/features/user/UserActions"
import { UserSearchForm } from "@/components/features/user/UserSearchForm"
import { DataTable } from "@/components/shared/data-table/data-table"
import { DataTableCell } from "@/components/shared/data-table/data-table-cell"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Badge } from "@/components/shared/ui/badge"
import { Card, CardContent } from "@/components/shared/ui/card"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { PAGINATION_KEY } from "@/constants/common"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import type { UserResponse } from "@/types/user.type"

export const UserList = () => {
  const [page, setPage] = useQueryState(PAGINATION_KEY.PAGE, parseAsInteger.withDefault(1))
  const [limit, setLimit] = useQueryState(PAGINATION_KEY.PER_PAGE, parseAsInteger.withDefault(10))
  const [keyword] = useQueryState("keyword", parseAsString.withDefault(""))

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.USERS_LIST, { keyword, page, limit }],
    queryFn: () => getAllUsers({ keyword, page: page - 1, limit }),
  })

  const users = data?.data || []
  const meta = data?.meta

  const columns = React.useMemo<ColumnDef<UserResponse>[]>(
    () => [
      {
        id: "avatar",
        accessorKey: "avatar",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Avatar" />
        ),
        cell: ({ row }) => (
          <Avatar className="size-10">
            <AvatarImage src={row.original.avatar || undefined} alt={row.original.name || ""} />
            <AvatarFallback>{row.original.name?.charAt(0) || row.original.username.charAt(0)}</AvatarFallback>
          </Avatar>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[80px]",
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Tên" />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.name || "N/A"} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[150px]",
        },
      },
      {
        id: "username",
        accessorKey: "username",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Username" />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.username} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[150px]",
        },
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => <DataTableCell value={row.original.email} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[200px]",
        },
      },
      {
        id: "sex",
        accessorKey: "sex",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Giới tính" />
        ),
        cell: ({ row }) => (
          <DataTableCell value={row.original.sex === "MALE" ? "Nam" : row.original.sex === "FEMALE" ? "Nữ" : "Khác"} />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[100px]",
        },
      },
      {
        id: "dateOfBirth",
        accessorKey: "dateOfBirth",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Ngày sinh" />
        ),
        cell: ({ row }) => {
          try {
            const date = row.original.dateOfBirth
            return <DataTableCell value={date ? format(new Date(date), "dd/MM/yyyy") : "N/A"} />
          } catch {
            return <DataTableCell value="N/A" />
          }
        },
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[120px]",
        },
      },
      {
        id: "role",
        accessorKey: "role",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Vai trò" />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.role.name === "ADMIN" ? "default" : "secondary"}>{row.original.role.name}</Badge>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[120px]",
        },
      },
      {
        id: "status",
        accessorKey: "isLocked",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.isLocked ? "destructive" : "default"}>
            {row.original.isLocked ? "Đã khóa" : "Hoạt động"}
          </Badge>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[120px]",
        },
      },
      {
        id: "actions",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Hành động" />
        ),
        cell: ({ row }) => <UserActions user={row.original} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[120px]",
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
    data: users,
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
    getRowId: (row) => row.id.toString(),
    manualPagination: true,
  })

  return (
    <div>
      <TypographyH3 variant="bold" className="mb-4">
        Quản lý người dùng
      </TypographyH3>
      <Card>
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton columnCount={columns.length} rowCount={10} filterCount={1} />
          ) : (
            <DataTable table={table}>
              <UserSearchForm isFetching={isFetching} />
            </DataTable>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
