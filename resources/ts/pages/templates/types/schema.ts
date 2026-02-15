import { z } from 'zod';

export const templateFieldSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, 'تسمية الحقل مطلوبة'),
    key: z.string()
        .min(1, 'المفتاح مطلوب')
        .regex(/^[a-z_][a-z0-9_]*$/, 'المفتاح يجب أن يبدأ بحرف ويحتوي على أحرف صغيرة وأرقام و_ فقط'),
    type: z.enum(['text', 'number', 'date', 'select', 'textarea']),
    source: z.enum(['manual', 'client', 'system']),
    is_required: z.boolean().default(false),
    client_role: z.enum(['seller', 'buyer', 'other']).nullable().optional(),
    client_field: z.string().nullable().optional(),
    system_value: z.string().nullable().optional(),
    options: z.array(z.object({
        label: z.string(),
        value: z.string(),
    })).optional(),
    sort_order: z.number().default(0),
}).refine((data) => {
    // إذا كان المصدر client، يجب تحديد الدور والحقل
    if (data.source === 'client') {
        return !!data.client_role && !!data.client_field;
    }
    return true;
}, {
    message: 'يجب تحديد دور العميل والحقل',
    path: ['client_role'],
}).refine((data) => {
    // إذا كان المصدر system، يجب تحديد القيمة
    if (data.source === 'system') {
        return !!data.system_value;
    }
    return true;
}, {
    message: 'يجب تحديد القيمة النظامية',
    path: ['system_value'],
}).refine((data) => {
    // إذا كان النوع select، يجب وجود خيارات
    if (data.type === 'select') {
        return (data.options?.length || 0) > 0;
    }
    return true;
}, {
    message: 'يجب إضافة خيارات للحقل من نوع قائمة',
    path: ['options'],
});

export const templateSchema = z.object({
    name: z.string()
        .min(3, 'اسم القالب يجب أن يكون 3 أحرف على الأقل')
        .max(255, 'اسم القالب طويل جداً'),
    
    contract_type: z.string()
        .min(1, 'نوع العقد مطلوب'),
    
    description: z.string()
        .max(500, 'الوصف طويل جداً')
        .optional()
        .nullable(),
    
    status: z.enum(['draft', 'active'])
        .default('draft'),
    
    content: z.string()
        .min(10, 'نص العقد يجب أن يكون 10 أحرف على الأقل'),
    
    fields: z.array(templateFieldSchema)
        .default([]),
});

export type TemplateFormData = z.infer<typeof templateSchema>;
