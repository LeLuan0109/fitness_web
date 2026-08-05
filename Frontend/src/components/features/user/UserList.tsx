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
import { PAGINATION_KEY } from "@/constants/common"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react"
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

  // Derive stats from current page data
  const totalUsers = meta?.totalItems ?? 0
  const activeCount = users.filter((u) => !u.isLocked && u.role.name !== "ADMIN").length
  const lockedCount = users.filter((u) => u.isLocked).length
  const adminCount = users.filter((u) => u.role.name === "ADMIN").length

  const columns = React.useMemo<ColumnDef<UserResponse>[]>(
    () => [
      {
        id: "avatar",
        accessorKey: "avatar",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Người dùng" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-10 ring-2 ring-primary/20 ring-offset-1 ring-offset-background">
              <AvatarImage src={row.original.avatar || undefined} alt={row.original.name || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {row.original.name?.charAt(0) || row.original.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{row.original.name || "N/A"}</p>
              <p className="truncate text-xs text-muted-foreground">@{row.original.username}</p>
            </div>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "min-w-[220px]",
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
          className: "w-[120px]",
        },
      },
      {
        id: "role",
        accessorKey: "role",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Vai trò" />
        ),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.original.role.name === "ADMIN"
                ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                : "border-border bg-muted text-muted-foreground font-medium"
            }
          >
            {row.original.role.name === "ADMIN" && <ShieldCheck className="mr-1 size-3" />}
            {row.original.role.name}
          </Badge>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[130px]",
        },
      },
      {
        id: "status",
        accessorKey: "isLocked",
        header: ({ column }: { column: Column<UserResponse, unknown> }) => (
          <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.original.isLocked
                ? "border-destructive/40 bg-destructive/10 text-destructive font-medium"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-medium dark:text-emerald-400"
            }
          >
            <span className={`mr-1.5 inline-block size-1.5 rounded-full ${row.original.isLocked ? "bg-destructive" : "bg-emerald-500"}`} />
            {row.original.isLocked ? "Đã khóa" : "Hoạt động"}
          </Badge>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: "w-[130px]",
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
          className: "w-[100px]",
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Quản lý người dùng</h2>
        <p className="mt-1 text-sm text-muted-foreground">Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống.</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Tổng người dùng</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <UserCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activeCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
          <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
            <UserX className="size-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{lockedCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Đã khóa</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
          <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
            <ShieldCheck className="size-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{adminCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Quản trị viên</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm backdrop-blur-sm">
        {isLoading ? (
          <div className="p-4">
            <DataTableSkeleton columnCount={columns.length} rowCount={10} filterCount={1} />
          </div>
        ) : (
          <DataTable table={table}>
            <UserSearchForm isFetching={isFetching} />
          </DataTable>
        )}
      </div>
    </div>
  )
}
