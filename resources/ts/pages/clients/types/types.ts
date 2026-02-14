export interface Client {
    id: string;
    office_id: string;
    first_name: string;
    last_name: string;
    father_name?: string | null;
    mother_name?: string | null;
    full_name: string; // محسوب
    
    // حقول جديدة
    nationality?: string | null;
    profession?: string | null;
    
    // وثائق الهوية
    national_id: string;
    id_card_number?: string | null;
    id_issue_date?: string | null;
    id_issuing_authority?: string | null;
    
    // معلومات الميلاد
    birth_date?: string | null;
    birth_place?: string | null;
    birth_certificate?: string | null;
    
    marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null;
    address?: string | null;
    phone?: string | null;
    
    created_at: string;
    updated_at: string;
}

export interface CreateClientDto {
    first_name: string;
    last_name: string;
    father_name?: string | null;
    mother_name?: string | null;
    nationality?: string | null;
    profession?: string | null;
    national_id: string;
    id_card_number?: string | null;
    id_issue_date?: string | null;
    id_issuing_authority?: string | null;
    birth_date?: string | null;
    birth_place?: string | null;
    birth_certificate?: string | null;
    marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null;
    address?: string | null;
    phone?: string | null;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export interface ClientFilters {
    search?: string;
    marital_status?: string;
    nationality?: string;
    profession?: string;
    from_date?: string;
    to_date?: string;
    sort_by?: 'created_at' | 'last_name' | 'first_name' | 'birth_date';
    sort_direction?: 'asc' | 'desc';
}