import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, AuthError } from '@/types';

// إنشاء instance من axios
const api = axios.create({
    baseURL: '/api/v1', // ✅ تأكد أن هذا صحيح
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// Interceptor للطلب: إضافة التوكن
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor للرد: معالجة الأخطاء بشكل موحد
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<AuthError>) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('office');
            
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// دالة للحصول على CSRF token
export const ensureCsrfToken = async (): Promise<void> => {
    await axios.get('/sanctum/csrf-cookie');
};

export default api;