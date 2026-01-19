'use client';

import { useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { NoDataComponent } from '@/components/errors/no-data';

export function DatatableWrapperComponent({ data, columns, placeholder, searchKey, ...props }) {
    const [sorting, setSorting] = useState([]);
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        defaultColumn: {
            minSize: 100,
            size: 200,
            maxSize: 400,
        },
        state: {
            sorting,
        },
    });

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center w-full">
                    <Input
                        placeholder={placeholder}
                        value={table.getColumn(searchKey)?.getFilterValue() ?? ''}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm mr-2 bg-card border-border/50 focus-visible:ring-0 focus-visible:border-border transition-[border-color] duration-300 ease-in-out"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {props.views && props.views.map((view) => view)}
                    {props.actions && props.actions.map((action) => action)}
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border/30 bg-card shadow-sm">
                {!data || data.length === 0 ? (
                    <NoDataComponent text="No data found" />
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={{
                                                        position: 'relative',
                                                        width: header.getSize(),
                                                    }}
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <>
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                            <div
                                                                onMouseDown={header.getResizeHandler()}
                                                                onTouchStart={header.getResizeHandler()}
                                                                className={`absolute right-0 top-0 h-full w-0.5 cursor-col-resize select-none touch-none bg-border/50 opacity-0 hover:opacity-100 transition-opacity ${
                                                                    header.column.getIsResizing()
                                                                        ? 'opacity-100 bg-primary/50'
                                                                        : ''
                                                                }`}
                                                            />
                                                        </>
                                                    )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && 'selected'}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Previous
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Next
                </Button>
            </div>
        </>
    );
}
