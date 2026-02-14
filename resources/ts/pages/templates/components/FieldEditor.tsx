import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    GripVertical,
    ChevronDown,
    ChevronUp,
    Trash2,
    Copy,
    Settings,
    Plus,
} from 'lucide-react';
import { TemplateField, FIELD_TYPES, FIELD_SOURCES, CLIENT_FIELDS, SYSTEM_VALUES } from '../types/templates';
import { cn } from '@/lib/utils';

interface FieldEditorProps {
    field: TemplateField;
    index: number;
    onUpdate: (field: TemplateField) => void;
    onRemove: () => void;
    onDuplicate: () => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
    field,
    index,
    onUpdate,
    onRemove,
    onDuplicate,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getSourceBadge = () => {
        const sourceMap = {
            manual: { label: 'يدوي', color: 'bg-blue-100 text-blue-800' },
            client: { label: 'بيانات عميل', color: 'bg-green-100 text-green-800' },
            system: { label: 'نظامي', color: 'bg-purple-100 text-purple-800' },
        };
        const source = sourceMap[field.source];
        return <Badge className={source.color}>{source.label}</Badge>;
    };

    const generateKeyFromLabel = (label: string) => {
        return label
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_');
    };

    const handleLabelChange = (label: string) => {
        const updates: Partial<TemplateField> = { label };
        
        // توليد key تلقائي إذا كان الحقل جديد أو key فارغ
        if (!field.key || field.key === generateKeyFromLabel(field.label)) {
            updates.key = generateKeyFromLabel(label);
        }
        
        onUpdate({ ...field, ...updates });
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className={cn(
                "border border-gray-200 hover:border-blue-300 transition-colors",
                isDragging && "shadow-lg"
            )}>
                {/* Header */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 border-b">
                    <div
                        className="cursor-move text-gray-400 hover:text-gray-600"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="flex-1 flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                            {field.label || `حقل ${index + 1}`}
                        </span>
                        {getSourceBadge()}
                        {field.is_required && (
                            <Badge variant="outline" className="border-red-200 text-red-600">
                                إجباري
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(!isOpen)}
                            className="h-8 w-8 p-0"
                        >
                            {isOpen ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                        
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDuplicate}
                            className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRemove}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {isOpen && (
                    <div className="p-4 space-y-4">
                        {/* الصف الأول: label و key */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">تسمية الحقل</Label>
                                <Input
                                    value={field.label}
                                    onChange={(e) => handleLabelChange(e.target.value)}
                                    placeholder="مثال: اسم البائع"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-sm">المفتاح (key)</Label>
                                <Input
                                    value={field.key}
                                    onChange={(e) => onUpdate({ ...field, key: e.target.value })}
                                    placeholder="seller_name"
                                    dir="ltr"
                                />
                                <p className="text-xs text-gray-500">
                                    يستخدم في النص بهذه الصيغة: {'{{'}{field.key}{'}}'}
                                </p>
                            </div>
                        </div>

                        {/* الصف الثاني: type و source */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">نوع الحقل</Label>
                                <Select
                                    value={field.type}
                                    onValueChange={(value: any) => onUpdate({ ...field, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FIELD_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">مصدر البيانات</Label>
                                <Select
                                    value={field.source}
                                    onValueChange={(value: any) => onUpdate({ ...field, source: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FIELD_SOURCES.map((source) => (
                                            <SelectItem key={source.value} value={source.value}>
                                                {source.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* خيارات حسب المصدر */}
                        {field.source === 'client' && (
                            <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
                                <div className="space-y-2">
                                    <Label className="text-sm">دور العميل</Label>
                                    <Select
                                        value={field.client_role || ''}
                                        onValueChange={(value: any) => onUpdate({ ...field, client_role: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الدور" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="seller">بائع</SelectItem>
                                            <SelectItem value="buyer">مشتري</SelectItem>
                                            <SelectItem value="other">أخرى</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm">حقل العميل</Label>
                                    <Select
                                        value={field.client_field || ''}
                                        onValueChange={(value) => onUpdate({ ...field, client_field: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحقل" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CLIENT_FIELDS.map((cf) => (
                                                <SelectItem key={cf.value} value={cf.value}>
                                                    {cf.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {field.source === 'system' && (
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="space-y-2">
                                    <Label className="text-sm">القيمة النظامية</Label>
                                    <Select
                                        value={field.system_value || ''}
                                        onValueChange={(value) => onUpdate({ ...field, system_value: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر القيمة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SYSTEM_VALUES.map((sv) => (
                                                <SelectItem key={sv.value} value={sv.value}>
                                                    {sv.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {field.type === 'select' && (
                            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                                <Label className="text-sm">خيارات القائمة</Label>
                                <div className="space-y-2">
                                    {(field.options || []).map((option, optIndex) => (
                                        <div key={optIndex} className="flex gap-2">
                                            <Input
                                                placeholder="التسمية"
                                                value={option.label}
                                                onChange={(e) => {
                                                    const newOptions = [...(field.options || [])];
                                                    newOptions[optIndex] = { 
                                                        ...option, 
                                                        label: e.target.value 
                                                    };
                                                    onUpdate({ ...field, options: newOptions });
                                                }}
                                            />
                                            <Input
                                                placeholder="القيمة"
                                                value={option.value}
                                                onChange={(e) => {
                                                    const newOptions = [...(field.options || [])];
                                                    newOptions[optIndex] = { 
                                                        ...option, 
                                                        value: e.target.value 
                                                    };
                                                    onUpdate({ ...field, options: newOptions });
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const newOptions = (field.options || []).filter((_, i) => i !== optIndex);
                                                    onUpdate({ ...field, options: newOptions });
                                                }}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newOptions = [
                                                ...(field.options || []),
                                                { label: '', value: '' }
                                            ];
                                            onUpdate({ ...field, options: newOptions });
                                        }}
                                        className="mt-2"
                                    >
                                        <Plus className="h-4 w-4 ml-2" />
                                        إضافة خيار
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* إجباري */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id={`required-${field.key}`}
                                checked={field.is_required}
                                onCheckedChange={(checked) => 
                                    onUpdate({ ...field, is_required: checked as boolean })
                                }
                            />
                            <Label htmlFor={`required-${field.key}`} className="text-sm cursor-pointer">
                                هذا الحقل إجباري
                            </Label>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};