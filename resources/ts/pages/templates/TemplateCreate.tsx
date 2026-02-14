import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateForm } from './components/TemplateForm';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { FileText, Copy, Plus, Sparkles } from 'lucide-react';
import { PREDEFINED_TEMPLATES, PredefinedTemplate } from './data/defaults';

export const TemplateCreate: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState<PredefinedTemplate | null>(null);
    const [showPredefined, setShowPredefined] = useState(true);

    const handleUsePredefined = (template: PredefinedTemplate) => {
        setSelectedTemplate(template);
        setShowPredefined(false);
    };

    const handleCreateBlank = () => {
        setSelectedTemplate(null);
        setShowPredefined(false);
    };

    const handleBack = () => {
        setShowPredefined(true);
        setSelectedTemplate(null);
    };

    // إذا كان لا يزال في شاشة اختيار القالب
    if (showPredefined) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">إنشاء قالب جديد</h1>
                        <p className="text-sm text-gray-500">
                            اختر قالباً جاهزاً للبدء أو أنشئ قالباً فارغاً
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/templates')}
                    >
                        إلغاء
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* بطاقة القالب الفارغ */}
                    <Card 
                        className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed hover:border-blue-300"
                        onClick={handleCreateBlank}
                    >
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                <Plus className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>قالب فارغ</CardTitle>
                            <CardDescription>
                                ابدأ من الصفر وقم ببناء القالب حسب احتياجاتك
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="outline" className="text-blue-600">
                                بدون حقول مسبقة
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* القوالب الجاهزة */}
                    {PREDEFINED_TEMPLATES.map((template) => (
                        <Card 
                            key={template.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer group"
                            onClick={() => handleUsePredefined(template)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                        <FileText className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-800">
                                        {template.contract_type === 'sale' ? 'بيع' : 
                                         template.contract_type === 'rent' ? 'كراء' : 
                                         template.contract_type === 'power_of_attorney' ? 'وكالة' : 'أخرى'}
                                    </Badge>
                                </div>
                                <CardTitle>{template.name}</CardTitle>
                                <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Copy className="h-4 w-4" />
                                    <span>يحتوي على حقول مسبقة</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* معاينة سريعة للقالب (عند التحويم) - يمكن إضافتها لاحقاً */}
            </div>
        );
    }

    // عرض نموذج إنشاء القالب مع البيانات المختارة
    return (
        <div className="container mx-auto py-6">
            <div className="mb-4 flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="gap-2"
                >
                    ← العودة للقوالب الجاهزة
                </Button>
                {selectedTemplate && (
                    <Badge className="bg-purple-100 text-purple-800">
                        القالب: {selectedTemplate.name}
                    </Badge>
                )}
            </div>
           <TemplateForm 
                key={selectedTemplate?.id}
                initialData={selectedTemplate ? {
                    name: selectedTemplate.name,
                    contract_type: selectedTemplate.contract_type,
                    description: selectedTemplate.description,
                    status: 'draft',
                    content: selectedTemplate.content, // ✅ changed
                    fields: selectedTemplate.fields || [],
                } : undefined}
            />
        </div>
    );
};