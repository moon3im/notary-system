import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import '@/../css/index.css';

// Layouts
import AppLayout from '@/layouts/AppLayout';
import MainLayout from '@/layouts/MainLayout'; // ✅ الـ Layout الجديد
import { Clients } from './pages/clients/Clients';

import { Templates } from './pages/templates/Templates';

// Pages
import Login from '@/pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { TemplateCreate } from './pages/templates/TemplateCreate';
import { TemplateEdit } from './pages/templates/TemplateEdit';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const router = createBrowserRouter([
    {
        path: '/login',
        element: <AppLayout requireAuth={false} />,
        children: [
            {
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: '/',
        element: <MainLayout />, // ✅ استخدم MainLayout بدلاً من AppLayout
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'clients',
                element: <Clients />,
            },
            
           {
    path: 'templates',
    children: [
        {
            index: true,
            element: <Templates />,
        },
        {
            path: 'create',
            element: <TemplateCreate />,
        },
        {
            path: ':id/edit',
            element: <TemplateEdit />,
        },
       
    ],
},
            {
                path: 'contracts',
                element: <div>صفحة العقود</div>,
            },
            {
                path: 'office',
                element: <div>صفحة المكتب</div>,
            },
            {
                path: 'settings',
                element: <div>صفحة الإعدادات</div>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#10b981',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                        },
                    },
                }}
            />
        </QueryClientProvider>
    </React.StrictMode>
);