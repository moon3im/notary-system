import { ColumnDef } from "@tanstack/react-table";
import { Client } from "../types/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ClientActions } from "./ClientActions";

// دوال مساعدة للتنسيق
const getMaritalStatusBadge = (status: string | null) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
        single: { label: "أعزب", variant: "default" },
        married: { label: "متزوج", variant: "secondary" },
        divorced: { label: "مطلق", variant: "destructive" },
        widowed: { label: "أرمل", variant: "outline" },
    };
    
    return status && statusMap[status] ? statusMap[status] : { label: "-", variant: "outline" };
};

const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const clientColumns = (
    onEdit: (client: Client) => void,
    onDelete: (client: Client) => void,
    onView: (client: Client) => void,
    onAttach: (client: Client) => void
): ColumnDef<Client>[] => [
    {
        accessorKey: "full_name",
        header: "العميل",
        cell: ({ row }) => {
            const client = row.original;
            const initials = getInitials(client.first_name, client.last_name);
            const fullName = client.father_name 
                ? `${client.first_name} ${client.father_name} ${client.last_name}`
                : `${client.first_name} ${client.last_name}`;
            
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-200">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{fullName}</span>
                        <span className="text-xs text-gray-500">{client.national_id}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "phone",
        header: "الهاتف",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600" dir="ltr">
                {row.original.phone || "-"}
            </span>
        ),
    },
    {
        accessorKey: "birth_date",
        header: "تاريخ الميلاد",
        cell: ({ row }) => {
            const date = row.original.birth_date;
            return date ? (
                <span className="text-sm text-gray-600">
                    {format(new Date(date), "dd/MM/yyyy")}
                </span>
            ) : (
                <span className="text-sm text-gray-400">-</span>
            );
        },
    },
    {
        accessorKey: "marital_status",
        header: "الحالة الاجتماعية",
        cell: ({ row }) => {
            const status = row.original.marital_status;
            const { label, variant } = getMaritalStatusBadge(status);
            return status ? (
                <Badge variant={variant} className="text-xs">
                    {label}
                </Badge>
            ) : (
                <span className="text-sm text-gray-400">-</span>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "تاريخ الإضافة",
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
            <ClientActions
                client={row.original}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onAttach={onAttach}
            />
        ),
    },
];