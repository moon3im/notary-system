import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth';
import { User, Office, LoginCredentials } from '@/types';
import toast from 'react-hot-toast';

interface UseAuthReturn {
    user: User | null;
    office: Office | null;
    loading: boolean;
    isAuthenticated: boolean;
    isNotary: boolean;
    isAssistant: boolean;
    isOfficeActive: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(authService.getUser());
    const [office, setOffice] = useState<Office | null>(authService.getOffice());
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // التحقق من المصادقة عند تحميل الصفحة
    useEffect(() => {
        const verifyAuth = async () => {
            setLoading(true);
            
            // إذا كان هناك توكن، تحقق من صحته
            if (authService.getToken()) {
                const userData = await authService.checkAuth();
                if (userData) {
                    setUser(userData);
                    setOffice(authService.getOffice());
                }
            }
            
            setLoading(false);
        };

        verifyAuth();
    }, []);

    // تسجيل الدخول
    const login = useCallback(async (credentials: LoginCredentials) => {
        setLoading(true);
        
        try {
            const response = await authService.login(credentials);
            
            setUser(response.data.user);
            setOffice(response.data.office);
            
            toast.success(response.message || 'تم تسجيل الدخول بنجاح');
            navigate('/dashboard', { replace: true });
            
        } catch (error: any) {
            const message = error.response?.data?.message || 'فشل تسجيل الدخول';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // تسجيل الخروج
    const logout = useCallback(async () => {
        setLoading(true);
        
        try {
            await authService.logout();
            setUser(null);
            setOffice(null);
            toast.success('تم تسجيل الخروج بنجاح');
            navigate('/login', { replace: true });
        } catch (error) {
            toast.error('حدث خطأ أثناء تسجيل الخروج');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // التحقق من المصادقة يدوياً
    const checkAuth = useCallback(async (): Promise<boolean> => {
        const userData = await authService.checkAuth();
        return !!userData;
    }, []);

    return {
        user,
        office,
        loading,
        isAuthenticated: !!user,
        isNotary: authService.isNotary(),
        isAssistant: authService.isAssistant(),
        isOfficeActive: authService.isOfficeActive(),
        login,
        logout,
        checkAuth,
    };
};