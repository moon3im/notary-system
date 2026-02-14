import React from 'react';
import { Template } from '../types/templates';
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
    Copy,
    FileSignature,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface TemplateActionsProps {
    template: Template;
    onEdit: (template: Template) => void;
    onDelete: (template: Template) => void;
    onDuplicate: (template: Template) => void;
    onView: (template: Template) => void;
}

export const TemplateActions: React.FC<TemplateActionsProps> = ({
    template,
    onEdit,
    onDelete,
    onDuplicate,
    onView,
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
                
                <DropdownMenuItem onClick={() => onView(template)} className="gap-2 cursor-pointer">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span>عرض التفاصيل</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onEdit(template)} className="gap-2 cursor-pointer">
                    <Edit className="h-4 w-4 text-green-600" />
                    <span>تعديل</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onDuplicate(template)} className="gap-2 cursor-pointer">
                    <Copy className="h-4 w-4 text-purple-600" />
                    <span>نسخ</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="gap-2 cursor-pointer">
                    <FileSignature className="h-4 w-4 text-orange-600" />
                    <span>إنشاء عقد</span>
                </DropdownMenuItem>
                
                {template.status === 'draft' ? (
                    <DropdownMenuItem className="gap-2 cursor-pointer text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>نشر</span>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem className="gap-2 cursor-pointer text-gray-600">
                        <XCircle className="h-4 w-4" />
                        <span>إلغاء النشر</span>
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                    onClick={() => onDelete(template)} 
                    className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                    <Trash2 className="h-4 w-4" />
                    <span>حذف</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};