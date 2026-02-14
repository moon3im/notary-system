import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar 
                collapsed={sidebarCollapsed} 
                setCollapsed={setSidebarCollapsed} 
            />
            
            {/* Header (الآن يستقبل props) */}
            <Header 
                collapsed={sidebarCollapsed} 
                setCollapsed={setSidebarCollapsed} 
            />
            
            {/* Main Content */}
            <main className={cn(
                "pt-16 transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "pr-20" : "pr-72"
            )}>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;