import React, { useState } from 'react';
import { useTemplates } from './hooks/useTemplates';
import { TemplateFilters as FilterType, Template } from './types/templates';
import { templateColumns } from './components/TemplateTableColumns';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight,
    Loader2,
    FileText,
    Plus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Templates: React.FC = () => {
    const navigate = useNavigate();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<FilterType>({});
    
    const { 
        templates, 
        loading, 
        pagination, 
        deleteTemplate,
        duplicateTemplate,
        refetch 
    } = useTemplates(filters);

    const columns = templateColumns(
        (template) => navigate(`/templates/${template.id}/edit`),
        async (template) => {
            if (window.confirm('هل أنت متأكد من حذف هذا القالب؟')) {
                await deleteTemplate(template.id);
            }
        },
        async (template) => {
            await duplicateTemplate(template.id);
        },
        (template) => navigate(`/templates/${template.id}`)
    );

    const table = useReactTable({
        data: templates,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: pagination.lastPage,
    });

    const handleFilterChange = (newFilters: FilterType) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({});
    };

    if (loading && templates.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">قوالب العقود</h1>
                        <p className="text-sm text-gray-500">
                            إنشاء وإدارة قوالب العقود القانونية
                        </p>
                    </div>
                </div>
                
                <Button 
                    onClick={() => navigate('/templates/create')}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    قالب جديد
                </Button>
            </div>

            {/* Filters */}
                {/* <TemplateFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} /> */}

            {/* Table Card */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-lg">
                        قائمة القوالب 
                        <span className="mr-2 text-sm font-normal text-gray-500">
                            ({pagination.total} قالب)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
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
                                            className="hover:bg-gray-50"
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
                                            className="h-24 text-center text-gray-500"
                                        >
                                            لا يوجد قوالب للعرض
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            صفحة {pagination.currentPage} من {pagination.lastPage}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(0)}
                                disabled={pagination.currentPage === 1}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={pagination.currentPage === 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <span className="text-sm px-2">
                                {pagination.currentPage}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={pagination.currentPage === pagination.lastPage}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(pagination.lastPage - 1)}
                                disabled={pagination.currentPage === pagination.lastPage}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};