import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Search, 
    X, 
    Filter,
    Calendar,
    ArrowUpDown 
} from 'lucide-react';
import { ClientFilters as FilterType } from '../types/types';
import { maritalStatusOptions } from '../types/schema';

interface ClientFiltersProps {
    filters: FilterType;
    onFilterChange: (filters: FilterType) => void;
    onReset: () => void;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
    filters,
    onFilterChange,
    onReset,
}) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const handleMaritalStatusChange = (value: string) => {
        // ✅ إذا كانت القيمة "all"، نرسل undefined
        onFilterChange({ 
            ...filters, 
            marital_status: value === 'all' ? undefined : value 
        });
    };

    const handleSortChange = (value: string) => {
        const [sort_by, sort_direction] = value.split(':');
        onFilterChange({ 
            ...filters, 
            sort_by: sort_by as 'created_at' | 'last_name' | 'first_name',
            sort_direction: sort_direction as 'asc' | 'desc'
        });
    };

    const hasActiveFilters = filters.search || filters.marital_status;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">تصفية النتائج</span>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="mr-auto gap-1 text-xs h-7 px-2"
                    >
                        <X className="h-3 w-3" />
                        مسح الكل
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* بحث */}
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="بحث بالاسم أو رقم الهوية..."
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                        className="pr-9"
                    />
                </div>

                {/* فلتر الحالة الاجتماعية - ✅ تم التعديل هنا */}
                <Select
                    value={filters.marital_status || 'all'}
                    onValueChange={handleMaritalStatusChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="الحالة الاجتماعية" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">الكل</SelectItem> {/* ✅ قيمة غير فارغة */}
                        {maritalStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* ترتيب - ✅ تم التعديل هنا أيضاً */}
                <Select
                    value={`${filters.sort_by || 'created_at'}:${filters.sort_direction || 'desc'}`}
                    onValueChange={handleSortChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="ترتيب حسب" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_at:desc">الأحدث أولاً</SelectItem>
                        <SelectItem value="created_at:asc">الأقدم أولاً</SelectItem>
                        <SelectItem value="last_name:asc">الاسم (أ-ي)</SelectItem>
                        <SelectItem value="last_name:desc">الاسم (ي-أ)</SelectItem>
                        <SelectItem value="first_name:asc">الاسم الأول (أ-ي)</SelectItem>
                        <SelectItem value="first_name:desc">الاسم الأول (ي-أ)</SelectItem>
                    </SelectContent>
                </Select>

                {/* عداد النتائج */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                        {/* العدد سيجيء من الـ API */}
                    </span>
                </div>
            </div>
        </div>
    );
};