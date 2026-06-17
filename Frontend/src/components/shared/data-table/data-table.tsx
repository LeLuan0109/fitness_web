import { type Table as TanstackTable, flexRender } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/ui/table"
import { getCommonPinningStyles } from "@/lib/data-table"
import { cn } from "@/lib/utils"

import type * as React from "react"
import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  readonly isSelectedTable?: boolean
  table: TanstackTable<TData>
}

export function DataTable<TData>({
  table,
  children,
  className,
  isSelectedTable,
  ...props
}: Readonly<DataTableProps<TData>>) {
  return (
    <div className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)} {...props}>
      {children}
      <div className="overflow-hidden rounded-md border border-border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="[&>th]:border-r hover:bg-muted/70" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={cn(
                      "last:border-r-0 font-semibold text-foreground",
                      header.column.columnDef.meta?.className,
                    )}
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="[&>td]:border-r hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn("last:border-r-0 text-foreground", cell.column.columnDef.meta?.className)}
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center text-muted-foreground">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} isSelectedTable={isSelectedTable} />
      </div>
    </div>
  )
}
