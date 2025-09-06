"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchableColumnIdentifier: string
}

export function DataTable<TData, TValue>({columns, data, searchableColumnIdentifier}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    return (
    <div>
        <div className="flex items-center py-4">
            <Input
            placeholder="Search"
            value={(table.getColumn(searchableColumnIdentifier)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(searchableColumnIdentifier)?.setFilterValue(event.target.value)
            }
            className="w-full sm:w-50"
            />
        </div>

        <Table className="!z-0 overflow-hidden rounded-md border">
        <TableHeader className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-secondary/10 divide-secondary/10 divide-x-2">
                {headerGroup.headers.map((header) => {
                return (
                    <TableHead key={header.id} className="text-secondary font-bold">
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </TableHead>
                )
                })}
            </TableRow>
            ))}
        </TableHeader>

        <TableBody className="bg-primary">
            {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
                <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="divide-x divide-secondary/10 border-secondary/10 odd:bg-secondary/5 *:text-secondary"
                >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
                </TableRow>
            ))
            ) : (
            <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-secondary">
                No results.
                </TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>

        {/* pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
            <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>

            <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                Previous
                </Button>
                
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                Next
                </Button>
            </div>
        </div>
    </div>
    )
}