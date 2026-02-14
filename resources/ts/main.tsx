import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Layouts
import AppLayout from '@/layouts/AppLayout';

// Pages
import Login from '@/pages/auth/Login';

// مؤقتاً صفحات فارغة (سنملأها لاحقاً)
const Dashboard = () => <div>Dashboard</div>;

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
        element: <AppLayout requireAuth />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            // باقي الصفحات سنضيفها لاحقاً
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