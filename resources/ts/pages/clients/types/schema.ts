import { z } from 'zod';

// خيارات الحالة الاجتماعية
export const maritalStatusOptions = [
    { value: 'single', label: 'أعزب' },
    { value: 'married', label: 'متزوج' },
    { value: 'divorced', label: 'مطلق' },
    { value: 'widowed', label: 'أرمل' },
] as const;

// خيارات الجنسية (يمكن توسيعها لاحقاً)
export const nationalityOptions = [
    { value: 'جزائري', label: 'جزائري' },
    { value: 'أجنبي', label: 'أجنبي' },
] as const;

// خيارات المهنة
export const professionOptions = [
    { value: 'موظف', label: 'موظف' },
    { value: 'تاجر', label: 'تاجر' },
    { value: 'طبيب', label: 'طبيب' },
    { value: 'مهندس', label: 'مهندس' },
    { value: 'محام', label: 'محام' },
    { value: 'أستاذ', label: 'أستاذ' },
    { value: 'تقني', label: 'تقني' },
    { value: 'حرفي', label: 'حرفي' },
    { value: 'بدون عمل', label: 'بدون عمل' },
    { value: 'متقاعد', label: 'متقاعد' },
    { value: 'ربة بيت', label: 'ربة بيت' },
    { value: 'أخرى', label: 'أخرى' },
] as const;

// Zod schema للعميل مع الحقول الجديدة
export const clientSchema = z.object({
    // المعلومات الشخصية الأساسية
    first_name: z.string()
        .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
        .max(255, 'الاسم طويل جداً'),
    
    last_name: z.string()
        .min(2, 'اللقب يجب أن يكون على الأقل حرفين')
        .max(255, 'اللقب طويل جداً'),
    
    father_name: z.string()
        .max(255, 'اسم الأب طويل جداً')
        .optional()
        .nullable(),
    
    mother_name: z.string()
        .max(255, 'اسم الأم طويل جداً')
        .optional()
        .nullable(),
    
    // الجنسية والمهنة (جديد)
    nationality: z.string()
        .default('جزائري')
        .optional()
        .nullable(),
    
    profession: z.string()
        .max(255, 'المهنة طويل جداً')
        .optional()
        .nullable(),
    
    // وثائق الهوية
    national_id: z.string()
        .min(10, 'رقم التعريف الوطني يجب أن يكون 10 أرقام على الأقل')
        .max(20, 'رقم التعريف الوطني طويل جداً')
        .regex(/^[0-9]+$/, 'رقم التعريف الوطني يجب أن يحتوي على أرقام فقط'),
    
    id_card_number: z.string()
        .max(50, 'رقم بطاقة التعريف طويل جداً')
        .optional()
        .nullable(),
    
    // تواريخ إصدار البطاقة (جديد)
    id_issue_date: z.string()
        .optional()
        .nullable(),
    
    id_issuing_authority: z.string()
        .max(255, 'جهة الإصدار طويلة جداً')
        .optional()
        .nullable(),
    
    // معلومات الميلاد
    birth_date: z.string()
        .optional()
        .nullable(),
    
    birth_place: z.string()
        .max(255, 'مكان الميلاد طويل جداً')
        .optional()
        .nullable(),
    
    birth_certificate: z.string() // جديد
        .max(50, 'رقم شهادة الميلاد طويل جداً')
        .optional()
        .nullable(),
    
    marital_status: z.enum(['single', 'married', 'divorced', 'widowed'])
        .optional()
        .nullable(),
    
    // معلومات الاتصال
    address: z.string()
        .max(500, 'العنوان طويل جداً')
        .optional()
        .nullable(),
    
    phone: z.string()
        .regex(/^[0-9+\-\s]+$/, 'رقم الهاتف غير صحيح')
        .max(20, 'رقم الهاتف طويل جداً')
        .optional()
        .nullable(),
});

// نوع البيانات المستنتج من الـ schema
export type ClientFormData = z.infer<typeof clientSchema>;

// نوع البيانات للإرسال إلى API (بدون حقول محسوبة)
export type CreateClientDto = Omit<ClientFormData, 'id' | 'created_at' | 'updated_at' | 'full_name'>;

// حقول العملاء المتاحة للاستخدام في القوالب
export const CLIENT_FIELDS = [
    { value: 'full_name', label: 'الاسم الكامل' },
    { value: 'first_name', label: 'الاسم الأول' },
    { value: 'last_name', label: 'اللقب' },
    { value: 'father_name', label: 'اسم الأب' },
    { value: 'mother_name', label: 'اسم الأم' },
    { value: 'national_id', label: 'رقم التعريف الوطني' },
    { value: 'id_card_number', label: 'رقم بطاقة التعريف' },
    { value: 'id_issue_date', label: 'تاريخ إصدار البطاقة' },
    { value: 'id_issuing_authority', label: 'جهة إصدار البطاقة' },
    { value: 'birth_date', label: 'تاريخ الميلاد' },
    { value: 'birth_place', label: 'مكان الميلاد' },
    { value: 'birth_certificate', label: 'رقم شهادة الميلاد' },
    { value: 'marital_status', label: 'الحالة الاجتماعية' },
    { value: 'nationality', label: 'الجنسية' },
    { value: 'profession', label: 'المهنة' },
    { value: 'address', label: 'العنوان' },
    { value: 'phone', label: 'رقم الهاتف' },
] as const;