import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, GripVertical, Trash2, Copy } from 'lucide-react';
import { TemplateField, FIELD_TYPES, FIELD_SOURCES, CLIENT_FIELDS, SYSTEM_VALUES } from '../types/templates';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    restrictToVerticalAxis,
    restrictToParentElement,
} from '@dnd-kit/modifiers';
import { FieldEditor } from './FieldEditor';

interface DynamicFieldsBuilderProps {
    fields: TemplateField[];
    onChange: (fields: TemplateField[]) => void;
}

export const DynamicFieldsBuilder: React.FC<DynamicFieldsBuilderProps> = ({
    fields,
    onChange,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addField = () => {
        const newField: TemplateField = {
            label: '',
            key: '',
            type: 'text',
            source: 'manual',
            is_required: false,
            sort_order: fields.length,
            options: [],
        };
        onChange([...fields, newField]);
    };

    const updateField = (index: number, updatedField: TemplateField) => {
        const newFields = [...fields];
        newFields[index] = updatedField;
        onChange(newFields);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        // إعادة ترتيب sort_order
        newFields.forEach((field, i) => {
            field.sort_order = i;
        });
        onChange(newFields);
    };

    const duplicateField = (index: number) => {
        const fieldToDuplicate = { ...fields[index] };
        fieldToDuplicate.label = `${fieldToDuplicate.label} (نسخة)`;
        fieldToDuplicate.key = `${fieldToDuplicate.key}_copy`;
        fieldToDuplicate.sort_order = fields.length;
        
        onChange([...fields, fieldToDuplicate]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (active.id !== over?.id) {
            const oldIndex = fields.findIndex((f) => f.key === active.id);
            const newIndex = fields.findIndex((f) => f.key === over?.id);
            
            const newFields = arrayMove(fields, oldIndex, newIndex);
            // تحديث sort_order
            newFields.forEach((field, i) => {
                field.sort_order = i;
            });
            onChange(newFields);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">الحقول الديناميكية</CardTitle>
                <Button onClick={addField} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة حقل
                </Button>
            </CardHeader>
            <CardContent>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                >
                    <SortableContext
                        items={fields.map(f => f.key)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <FieldEditor
                                    key={field.key || `field-${index}`}
                                    field={field}
                                    index={index}
                                    onUpdate={(updatedField) => updateField(index, updatedField)}
                                    onRemove={() => removeField(index)}
                                    onDuplicate={() => duplicateField(index)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {fields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500 mb-4">لا توجد حقول ديناميكية بعد</p>
                        <Button onClick={addField} variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" />
                            إضافة أول حقل
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};