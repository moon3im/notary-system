import React from 'react';
import { Client } from '../types/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    FileSignature,
    FileText,
    Copy,
} from 'lucide-react';

interface ClientActionsProps {
    client: Client;
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
    onView: (client: Client) => void;
    onAttach: (client: Client) => void;
}

export const ClientActions: React.FC<ClientActionsProps> = ({
    client,
    onEdit,
    onDelete,
    onView,
    onAttach,
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">فتح القائمة</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => onView(client)} className="gap-2 cursor-pointer">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span>عرض التفاصيل</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onEdit(client)} className="gap-2 cursor-pointer">
                    <Edit className="h-4 w-4 text-green-600" />
                    <span>تعديل</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => onAttach(client)} className="gap-2 cursor-pointer">
                    <FileSignature className="h-4 w-4 text-purple-600" />
                    <span>إنشاء عقد</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span>عرض العقود</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Copy className="h-4 w-4 text-gray-600" />
                    <span>نسخ البيانات</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                    onClick={() => onDelete(client)} 
                    className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                    <Trash2 className="h-4 w-4" />
                    <span>حذف</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};