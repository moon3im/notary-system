// أنواع الحقول
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea';
export type FieldSource = 'manual' | 'client' | 'system';
export type ClientRole = 'seller' | 'buyer' | 'other' | null;

export interface TemplateField {
    id?: string;
    label: string;
    key: string;
    type: FieldType;
    source: FieldSource;
    is_required: boolean;
    client_role?: ClientRole;
    client_field?: string;
    system_value?: string;
    options?: Array<{ label: string; value: string }>;
    sort_order: number;
}

export interface Template {
    id: string;
    office_id: string;
    created_by: string;
    name: string;
    contract_type: string;
    description?: string | null;
    status: 'draft' | 'active';
 content: string;
     fields: TemplateField[];
    created_at: string;
    updated_at: string;
    creator_name?: string;
}

export interface CreateTemplateDto {
    name: string;
    contract_type: string;
    description?: string | null;
    status: 'draft' | 'active';
    content: string;
     fields: Omit<TemplateField, 'id'>[];
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

export interface TemplateFilters {
    search?: string;
    contract_type?: string;
    status?: 'draft' | 'active';
    sort_by?: 'name' | 'created_at' | 'contract_type';
    sort_direction?: 'asc' | 'desc';
}

// أنواع ثابتة للاستخدام
export const CONTRACT_TYPES = [
    { value: 'sale', label: 'عقد بيع' },
    { value: 'rent', label: 'عقد كراء' },
    { value: 'power_of_attorney', label: 'وكالة' },
    { value: 'gift', label: 'هبة' },
    { value: 'partnership', label: 'شراكة' },
    { value: 'other', label: 'أخرى' },
] as const;

export const FIELD_TYPES = [
    { value: 'text', label: 'نص' },
    { value: 'number', label: 'رقم' },
    { value: 'date', label: 'تاريخ' },
    { value: 'select', label: 'قائمة منسدلة' },
    { value: 'textarea', label: 'نص طويل' },
] as const;

export const FIELD_SOURCES = [
    { value: 'manual', label: 'يدوي' },
    { value: 'client', label: 'بيانات عميل' },
    { value: 'system', label: 'نظامي' },
] as const;

// أضف هذه الحقول إلى CLIENT_FIELDS
export const CLIENT_FIELDS = [
    { value: 'full_name', label: 'الاسم الكامل' },
    { value: 'first_name', label: 'الاسم الأول' },
    { value: 'last_name', label: 'اللقب' },
    { value: 'father_name', label: 'اسم الأب' },
    { value: 'mother_name', label: 'اسم الأم' },
    { value: 'national_id', label: 'رقم التعريف الوطني' },
    { value: 'id_card_number', label: 'رقم بطاقة التعريف' },
    { value: 'birth_date', label: 'تاريخ الميلاد' },
    { value: 'birth_place', label: 'مكان الميلاد' },
    { value: 'marital_status', label: 'الحالة الاجتماعية' },
    { value: 'address', label: 'العنوان' },
    { value: 'phone', label: 'رقم الهاتف' },
    { value: 'nationality', label: 'الجنسية' }, // جديد
    { value: 'profession', label: 'المهنة' }, // جديد
    { value: 'birth_certificate', label: 'رقم شهادة الميلاد' }, // جديد
    { value: 'id_issue_date', label: 'تاريخ إصدار البطاقة' }, // جديد
    { value: 'id_issuing_authority', label: 'جهة إصدار البطاقة' }, // جديد
] as const;

export const SYSTEM_VALUES = [
    { value: 'today', label: 'تاريخ اليوم' },
    { value: 'now', label: 'الوقت الحالي' },
    { value: 'contract_number', label: 'رقم العقد' },
    { value: 'office_name', label: 'اسم المكتب' },
    { value: 'office_id', label: 'رقم المكتب' },
    { value: 'notary_name', label: 'اسم الموثق' }, // جديد
    { value: 'notary_office', label: 'عنوان المكتب' }, // جديد
    { value: 'current_user_name', label: 'اسم المستخدم الحالي' },
    { value: 'current_user_id', label: 'رقم المستخدم الحالي' },
] as const;