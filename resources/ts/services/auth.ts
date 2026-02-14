import api, { ensureCsrfToken } from './api';
import { LoginCredentials, LoginResponse, User, Office, Subscription } from '@/types';
import { AxiosError } from 'axios';

// تعريف واجهة ApiResponse محلياً إذا لم تكن مستوردة
interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user';
    private readonly OFFICE_KEY = 'office';
    private readonly SUBSCRIPTION_KEY = 'subscription';

    // تسجيل الدخول
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            // التأكد من وجود CSRF token (للأمان)
            await ensureCsrfToken();
            
            // ✅ ملاحظة: المسار يجب أن يبدأ بدون "/" لأن baseURL موجود
            const response = await api.post<LoginResponse>('auth/login', credentials);
            
            if (response.data?.success && response.data?.data?.token) {
                // حفظ البيانات في localStorage
                this.setToken(response.data.data.token);
                this.setUser(response.data.data.user);
                this.setOffice(response.data.data.office);
                
                if (response.data.data.subscription) {
                    this.setSubscription(response.data.data.subscription);
                }
                
                return response.data;
            }
            
            throw new Error(response.data?.message || 'فشل تسجيل الدخول');
            
        } catch (error) {
            // تحسين معالجة الأخطاء
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message || 
                               error.response?.data?.errors?.email?.[0] || 
                               'فشل الاتصال بالخادم';
                throw new Error(message);
            }
            throw error;
        }
    }

    // تسجيل الخروج
    async logout(): Promise<void> {
        try {
            await api.post('auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearStorage();
            // إعادة توجيه إلى صفحة login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    // التحقق من المصادقة
    async checkAuth(): Promise<User | null> {
        try {
            const response = await api.get<ApiResponse<{ user: User }>>('auth/me');
            
            if (response.data?.success && response.data?.data?.user) {
                this.setUser(response.data.data.user);
                return response.data.data.user;
            }
            
            return null;
            
        } catch (error) {
            this.clearStorage();
            return null;
        }
    }

    // إدارة التوكن
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    // إدارة المستخدم
    setUser(user: User): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }

    getUser(): User | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem(this.USER_KEY);
            if (userStr) {
                try {
                    return JSON.parse(userStr) as User;
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    // إدارة المكتب
    setOffice(office: Office): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.OFFICE_KEY, JSON.stringify(office));
        }
    }

    getOffice(): Office | null {
        if (typeof window !== 'undefined') {
            const officeStr = localStorage.getItem(this.OFFICE_KEY);
            if (officeStr) {
                try {
                    return JSON.parse(officeStr) as Office;
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    // إدارة الاشتراك
    setSubscription(subscription: Subscription): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.SUBSCRIPTION_KEY, JSON.stringify(subscription));
        }
    }

    // مسح التخزين
    clearStorage(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
            localStorage.removeItem(this.OFFICE_KEY);
            localStorage.removeItem(this.SUBSCRIPTION_KEY);
        }
    }

    // التحقق من الأدوار
    isNotary(): boolean {
        const user = this.getUser();
        return user?.role === 'notary';
    }

    isAssistant(): boolean {
        const user = this.getUser();
        return user?.role === 'assistant';
    }

    // التحقق من حالة المكتب
    isOfficeActive(): boolean {
        const office = this.getOffice();
        return office?.subscription_status === 'active';
    }

    // هل المستخدم مسجل دخول؟
    isAuthenticated(): boolean {
        return !!this.getToken() && !!this.getUser();
    }
}

// تصدير instance واحد فقط (Singleton)
export default new AuthService();