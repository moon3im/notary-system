import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, FileText, Settings, ListChecks } from 'lucide-react';
import { templateSchema, TemplateFormData } from '../types/schema';
import { CONTRACT_TYPES } from '../types/templates';
import { DynamicFieldsBuilder } from './DynamicFieldsBuilder';
import { Template } from '../types/templates';
import { useTemplates } from '../hooks/useTemplates';
import { toast } from 'react-hot-toast';
import { LexicalTemplateEditor } from './LexicalTemplateEditor';

interface TemplateFormProps {
    initialData?: Template;
    isEditing?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
    initialData,
    isEditing = false,
}) => {
    const navigate = useNavigate();
    const { createTemplate, updateTemplate, isCreating, isUpdating } = useTemplates();

    const form = useForm<TemplateFormData>({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            name: '',
            contract_type: '',
            description: '',
            status: 'draft',
            content: '',
            fields: [],
        },
    });

    // تعبئة النموذج في حالة التعديل
    useEffect(() => {
    if (initialData) {
        form.reset({
            name: initialData.name,
            contract_type: initialData.contract_type,
            description: initialData.description || '',
            status: initialData.status || 'draft',
            content: initialData.content, // ✅ changed
            fields: initialData.fields || [],
        });
    } else {
        form.reset({
            name: '',
            contract_type: '',
            description: '',
            status: 'draft',
            body: '',
            fields: [],
        });
    }
}, [initialData, form]);    

  const onSubmit = async (data: TemplateFormData) => {
    console.log('1️⃣ Form submitted with data:', data); // ✅ هل يظهر هذا؟
    
    try {
        // التأكد من إرسال content بدلاً من body
        const payload = {
            ...data,
            content: data.content, // تأكد من استخدام content
            fields: data.fields || []
        };
        
        console.log('2️⃣ Payload to send:', payload); // ✅ هل يظهر هذا؟
        
        if (isEditing && initialData) {
            console.log('3️⃣ Updating template...');
            await updateTemplate(initialData.id, payload);
            toast.success('تم تحديث القالب بنجاح');
        } else {
            console.log('3️⃣ Creating template...');
            await createTemplate(payload);
            toast.success('تم إنشاء القالب بنجاح');
        }
        
        console.log('4️⃣ Operation successful!');
        navigate('/templates');
    } catch (error) {
        console.error('5️⃣ Error in onSubmit:', error); // ✅ هل يظهر هذا؟
    }
};

    const loading = isCreating || isUpdating;

    // معاينة النص مع placeholders
    const previewText = form.watch('body');
    const fields = form.watch('fields');

    const getPreviewWithPlaceholders = () => {
        let preview = previewText || '';
        fields.forEach(field => {
            const placeholder = `{{${field.key}}}`;
            const sampleValue = field.source === 'client' 
                ? `[${field.label}]` 
                : field.source === 'system'
                ? `[قيمة نظامية: ${field.label}]`
                : `[${field.label}]`;
            
            // تمييز الـ placeholders في المعاينة
            preview = preview.replace(
                new RegExp(placeholder, 'g'),
                `<span class="bg-yellow-100 text-yellow-800 px-1 rounded">${sampleValue}</span>`
            );
        });
        return preview;
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Header with actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditing ? 'تعديل القالب' : 'إنشاء قالب جديد'}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {isEditing 
                                    ? 'تعديل بيانات القالب والحقول الديناميكية'
                                    : 'أنشئ قالب عقد مع حقول ديناميكية قابلة للتخصيص'
                                }
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/templates')}
                            disabled={loading}
                        >
                            إلغاء
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="gap-2 min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isEditing ? 'تحديث' : 'حفظ'}
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Main Content with Tabs */}
                <Tabs defaultValue="basic" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                        <TabsTrigger value="basic" className="gap-2">
                            <Settings className="h-4 w-4" />
                            المعلومات الأساسية
                        </TabsTrigger>
                        <TabsTrigger value="fields" className="gap-2">
                            <ListChecks className="h-4 w-4" />
                            الحقول الديناميكية
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2">
                            <FileText className="h-4 w-4" />
                            معاينة
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Basic Info */}
                    <TabsContent value="basic" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>معلومات القالب</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم القالب *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="مثال: عقد بيع عقار" 
                                                        {...field} 
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contract_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>نوع العقد *</FormLabel>
                                                <Select 
                                                    onValueChange={field.onChange} 
                                                    value={field.value}
                                                    disabled={loading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="اختر نوع العقد" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CONTRACT_TYPES.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>وصف القالب</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="وصف مختصر للقالب واستخداماته..."
                                                    {...field}
                                                    value={field.value || ''}
                                                    disabled={loading}
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>نص العقد القانوني *</FormLabel>
                                            <FormControl>
                                                <LexicalTemplateEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="اكتب نص العقد هنا... استخدم {{ لفتح قائمة الحقول"
                                                    height="600px"
                                                />
                                            </FormControl>
                                            
                                            <p className="text-sm text-gray-500">
                                                📝 يمكنك تنسيق النص وتلوينه حسب رغبتك
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">حالة القالب</FormLabel>
                                                <p className="text-sm text-gray-500">
                                                    {field.value === 'active' 
                                                        ? 'القالب نشط ويمكن استخدامه في إنشاء العقود'
                                                        : 'القالب مسودة ولا يظهر في قائمة العقود'
                                                    }
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value === 'active'}
                                                    onCheckedChange={(checked) => 
                                                        field.onChange(checked ? 'active' : 'draft')
                                                    }
                                                    disabled={loading}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab 2: Dynamic Fields */}
                    <TabsContent value="fields">
                        <FormField
                            control={form.control}
                            name="fields"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DynamicFieldsBuilder
                                            fields={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    {/* Tab 3: Preview */}
                    <TabsContent value="preview">
                        <Card>
                            <CardHeader>
                                <CardTitle>معاينة القالب</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {previewText ? (
                                    <div 
                                        className="prose prose-sm max-w-none p-4 border rounded-lg bg-gray-50"
                                        dangerouslySetInnerHTML={{ 
                                            __html: getPreviewWithPlaceholders() 
                                        }}
                                    />
                                ) : (
                                    <p className="text-center text-gray-500 py-12">
                                        اكتب نص العقد في قسم المعلومات الأساسية لرؤية المعاينة
                                    </p>
                                )}

                                {fields.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">الحقول المستخدمة:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {fields.map((field, idx) => (
                                                <div 
                                                    key={idx}
                                                    className="text-sm p-2 bg-gray-50 rounded flex items-center gap-2"
                                                >
                                                    <span className="font-mono text-purple-600">
                                                        {'{{'}{field.key}{'}}'}
                                                    </span>
                                                    <span className="text-gray-600">→</span>
                                                    <span>{field.label}</span>
                                                    {field.is_required && (
                                                        <span className="text-red-500 text-xs">*</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    );
};