import api, { ensureCsrfToken } from './api';
import { LoginCredentials, LoginResponse, User, Office, Subscription } from '@/types';

class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user';
    private readonly OFFICE_KEY = 'office';

    // تسجيل الدخول
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        // التأكد من وجود CSRF token (للأمان)
        await ensureCsrfToken();
        
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        
        if (response.data.success && response.data.data.token) {
            // حفظ البيانات في localStorage
            this.setToken(response.data.data.token);
            this.setUser(response.data.data.user);
            this.setOffice(response.data.data.office);
            
            // يمكن حفظ الاشتراك إذا وجد
            if (response.data.data.subscription) {
                this.setSubscription(response.data.data.subscription);
            }
        }
        
        return response.data;
    }

    // تسجيل الخروج
    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // مسح البيانات محلياً حتى لو فشل الطلب
            this.clearStorage();
        }
    }

    // التحقق من المصادقة
    async checkAuth(): Promise<User | null> {
        try {
            const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
            if (response.data.success) {
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
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // إدارة المستخدم
    setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    getUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr) as User;
            } catch {
                return null;
            }
        }
        return null;
    }

    // إدارة المكتب
    setOffice(office: Office): void {
        localStorage.setItem(this.OFFICE_KEY, JSON.stringify(office));
    }

    getOffice(): Office | null {
        const officeStr = localStorage.getItem(this.OFFICE_KEY);
        if (officeStr) {
            try {
                return JSON.parse(officeStr) as Office;
            } catch {
                return null;
            }
        }
        return null;
    }

    // إدارة الاشتراك (اختياري)
    setSubscription(subscription: Subscription): void {
        localStorage.setItem('subscription', JSON.stringify(subscription));
    }

    // مسح التخزين
    clearStorage(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.OFFICE_KEY);
        localStorage.removeItem('subscription');
    }

    // هل المستخدم موثق؟ (للتحقق من الصلاحيات)
    isNotary(): boolean {
        const user = this.getUser();
        return user?.role === 'notary';
    }

    // هل المستخدم مساعد؟
    isAssistant(): boolean {
        const user = this.getUser();
        return user?.role === 'assistant';
    }

    // هل المكتب نشط؟
    isOfficeActive(): boolean {
        const office = this.getOffice();
        return office?.subscription_status === 'active';
    }
}

// تصدير instance واحد فقط (Singleton)
export default new AuthService();