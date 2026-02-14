// أنواع مطابقة تماماً للـ Backend (Laravel Models)

export interface User {
    id: string;                    // UUID كما في Backend
    name: string;
    email: string;
    role: 'notary' | 'assistant';  // Enum مطابق
    phone: string | null;
    office_id: string;
    created_at: string;
    updated_at: string;
}

export interface Office {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    subscription_status: 'inactive' | 'active' | 'suspended';
}

export interface Subscription {
    id: string;
    office_id: string;
    plan_type: 'monthly' | 'yearly';
    status: 'active' | 'expired' | 'cancelled' | 'suspended';
    started_at: string;
    ended_at: string | null;
    auto_renew: boolean;
}

// أنواع خاصة بالمصادقة
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        office: Office;
        subscription: Subscription | null;
        token: string;
    };
}

export interface AuthError {
    message: string;
    errors?: Record<string, string[]>;
}

// نوع للـ API responses الموحدة
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}