import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    FileSignature,
    Building2,
    Settings,
    Scale,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
    const location = useLocation();

    const navigation = [
        { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
        { name: 'العملاء', href: '/clients', icon: Users },
        { name: 'القوالب', href: '/templates', icon: FileText },
        { name: 'العقود', href: '/contracts', icon: FileSignature },
        { name: 'المكتب', href: '/office', icon: Building2 },
        { name: 'الإعدادات', href: '/settings', icon: Settings },
    ];

    return (
        <aside
            className={cn(
                "fixed right-0 top-0 h-screen bg-white border-l border-gray-200 z-50 transition-all duration-300 ease-in-out flex flex-col",
                collapsed ? "w-20" : "w-72"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-gray-100">
                <div className={cn(
                    "flex items-center gap-3 w-full",
                    collapsed && "justify-center"
                )}>
                    <Scale className="h-7 w-7 text-blue-600" />

                    {!collapsed && (
                        <div>
                            <span className="font-semibold text-lg text-gray-900">
                                منصة التوثيق
                            </span>
                            <span className="block text-xs text-gray-500">
                                إدارة احترافية
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200",
                                collapsed && "justify-center",
                                isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-blue-600" : "text-gray-500"
                                )}
                            />

                            {!collapsed && (
                                <span className="text-sm">{item.name}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 space-y-1">
                <button
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition w-full",
                        collapsed && "justify-center"
                    )}
                >
                    <HelpCircle className="h-5 w-5" />
                    {!collapsed && <span className="text-sm">مساعدة</span>}
                </button>

                <button
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition w-full",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && (
                        <span className="text-sm font-medium">تسجيل الخروج</span>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
