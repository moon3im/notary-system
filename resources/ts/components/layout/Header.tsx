import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
    LogOut,
    User,
    Bell,
    Search,
    Plus,
    FileSignature,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ClientForm } from '@/pages/clients/components/ClientForm';
import { useClients } from '@/pages/clients/hooks/useClients';

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
    const { user, logout } = useAuth();

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [quickMenuOpen, setQuickMenuOpen] = useState(false);
    
    // State للفورم
    const [clientFormOpen, setClientFormOpen] = useState(false);
    const [contractFormOpen, setContractFormOpen] = useState(false);
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    const quickMenuRef = useRef<HTMLDivElement>(null);
    const { createClient, isCreating } = useClients();
const handleAddClient = async (data: any) => {
    try {
        console.log('Submitting client data:', data); // ✅ تأكد من ظهور هذا في Console
        await createClient(data);
        console.log('Client created successfully'); // ✅ تأكد من ظهور هذا
        setClientFormOpen(false);
    } catch (error) {
        console.error('Error creating client:', error); // ✅ شوف الخطأ
    }
};

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
            if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
                setQuickMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300",
                    collapsed ? "pr-20" : "pr-72"
                )}
            >
                <div className="h-full px-6 flex items-center justify-between">

                    {/* Left Section (Search + Collapse) */}
                    <div className="flex items-center gap-3 flex-1 max-w-lg">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                        >
                            {collapsed ? (
                                <ChevronLeft className="h-4 w-4 text-gray-600" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                        </button>

                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="بحث عن عقد، عميل..."
                                className="w-full pl-4 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">

                        {/* Quick Actions */}
                        <div className="relative" ref={quickMenuRef}>
                            <button
                                onClick={() => setQuickMenuOpen(!quickMenuOpen)}
                                className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                            </button>

                            {quickMenuOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                                    <button
                                        onClick={() => {
                                            setQuickMenuOpen(false);
                                            setContractFormOpen(true);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition"
                                    >
                                        <FileSignature className="h-4 w-4 text-blue-600" />
                                        إنشاء عقد
                                    </button>
                                    <button
                                        onClick={() => {
                                            setQuickMenuOpen(false);
                                            setClientFormOpen(true);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition"
                                    >
                                        <Users className="h-4 w-4 text-green-600" />
                                        إضافة عميل
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <button className="relative w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>

                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="h-4 w-4 text-blue-600" />
                                </div>
                            </button>

                            {userMenuOpen && (
                                <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition"
                                    >
                                        <User className="h-4 w-4 text-gray-600" />
                                        الملف الشخصي
                                    </Link>

                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition"
                                    >
                                        <Settings className="h-4 w-4 text-gray-600" />
                                        الإعدادات
                                    </Link>

                                    <div className="border-t my-2"></div>

                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        تسجيل الخروج
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Client Form Modal */}
           <ClientForm
    open={clientFormOpen}
    onOpenChange={setClientFormOpen}
    onSubmit={handleAddClient}
    loading={isCreating}
/>

            {/* Contract Form Modal (هنعمله لاحقاً) */}
            {/* <ContractForm
                open={contractFormOpen}
                onOpenChange={setContractFormOpen}
                onSubmit={handleAddContract}
            /> */}
        </>
    );
};

export default Header;