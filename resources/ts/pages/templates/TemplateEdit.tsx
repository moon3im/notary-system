import React from 'react';
import { useParams } from 'react-router-dom';
import { TemplateForm } from './components/TemplateForm';
import { useTemplate } from './hooks/useTemplates';
import { Loader2 } from 'lucide-react';

export const TemplateEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: template, isLoading, error } = useTemplate(id!);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">حدث خطأ في تحميل القالب</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <TemplateForm 
                initialData={template} 
                isEditing={true} 
            />
        </div>
    );
};