import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
    requireAuth?: boolean;
    requireNotary?: boolean;
}

export default function AppLayout({ 
    requireAuth = true,
    requireNotary = false 
}: AppLayoutProps) {
    const { isAuthenticated, isNotary, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // إذا كانت الصفحة تتطلب مصادقة والمستخدم غير مصادق
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // إذا كانت الصفحة تتطلب موثق والمستخدم ليس موثقاً
    if (requireNotary && !isNotary) {
        return <Navigate to="/dashboard" replace />;
    }

    // إذا كان المستخدم مصادق ويحاول الذهاب لصفحة login
    if (!requireAuth && isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}