import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CONTRACT_TYPES, Template } from "../types/templates";
import { TemplateActions } from "./TemplateActions";

const getContractTypeLabel = (type: string) => {
    const found = CONTRACT_TYPES.find(t => t.value === type);
    return found?.label || type;
};

const getStatusBadge = (status: string) => {
    if (status === 'active') {
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">نشط</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">مسودة</Badge>;
};

export const templateColumns = (
    onEdit: (template: Template) => void,
    onDelete: (template: Template) => void,
    onDuplicate: (template: Template) => void,
    onView: (template: Template) => void
): ColumnDef<Template>[] => [
    {
        accessorKey: "name",
        header: "اسم القالب",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-gray-900">{row.original.name}</span>
                {row.original.description && (
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                        {row.original.description}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "contract_type",
        header: "نوع العقد",
        cell: ({ row }) => (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {getContractTypeLabel(row.original.contract_type)}
            </Badge>
        ),
    },
    {
        accessorKey: "fields_count",
        header: "عدد الحقول",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.fields?.length || 0} حقل
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "الحالة",
        cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
        accessorKey: "created_at",
        header: "تاريخ الإنشاء",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {format(new Date(row.original.created_at), "dd/MM/yyyy", { locale: ar })}
            </span>
        ),
    },
    {
        id: "actions",
        header: "الإجراءات",

        cell: ({ row }) => (
            <TemplateActions
                template={row.original}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onView={onView}
            />
        ),
    },
];