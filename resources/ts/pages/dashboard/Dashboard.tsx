import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    FileText,
    FileSignature,
    Briefcase,
    Calendar,
    TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    const { user, office } = useAuth();

    const stats = [
        {
            title: 'إجمالي العملاء',
            value: '0',
            icon: Users,
            color: 'blue',
            change: '+12%',
            changeType: 'increase'
        },
        {
            title: 'القوالب',
            value: '0',
            icon: FileText,
            color: 'green',
            change: '0',
            changeType: 'neutral'
        },
        {
            title: 'العقود',
            value: '0',
            icon: FileSignature,
            color: 'purple',
            change: '+5%',
            changeType: 'increase'
        },
        {
            title: 'العقود هذا الشهر',
            value: '0',
            icon: Calendar,
            color: 'orange',
            change: '0',
            changeType: 'neutral'
        },
    ];

    const recentContracts = [
        { id: 1, number: '2025-001', client: 'محمد أحمد', type: 'عقد بيع', date: '2025-02-14' },
        { id: 2, number: '2025-002', client: 'فاطمة علي', type: 'عقد كراء', date: '2025-02-13' },
        { id: 3, number: '2025-003', client: 'عمر خالد', type: 'عقد هبة', date: '2025-02-12' },
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'bg-blue-500/10 text-blue-600',
            green: 'bg-emerald-500/10 text-emerald-600',
            purple: 'bg-violet-500/10 text-violet-600',
            orange: 'bg-amber-500/10 text-amber-600',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-8 shadow-xl text-white">
    
    {/* Decorative Blur Elements */}
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-black/10 rounded-full blur-3xl" />

    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        
        {/* User Info Section */}
        <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                مرحباً، {user?.name}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-white/90">
                <span className="px-3 py-1 text-xs rounded-full bg-white/20 backdrop-blur">
                    {user?.role === 'notary' ? 'موثق' : 'مساعد'}
                </span>
                <span className="text-sm">
                    {office?.name}
                </span>
            </div>

            <p className="mt-4 text-white/80 max-w-xl text-sm leading-relaxed">
                يمكنك إدارة العقود، القوالب، والعملاء بسهولة من خلال الإجراءات السريعة أدناه.
            </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
            
            <button className="px-6 py-3 rounded-2xl bg-white text-blue-700 font-medium shadow-md hover:shadow-lg transition hover:-translate-y-0.5">
                ➕ إضافة عقد
            </button>

            <button className="px-6 py-3 rounded-2xl bg-white/20 backdrop-blur border border-white/30 text-white font-medium hover:bg-white/30 transition">
                👤 إضافة عميل
            </button>

            <button className="px-6 py-3 rounded-2xl bg-white/20 backdrop-blur border border-white/30 text-white font-medium hover:bg-white/30 transition">
                📄 إضافة قالب
            </button>
        </div>

    </div>
</div>


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <Card
                            key={index}
                            className="group rounded-2xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {stat.title}
                                        </p>

                                        <p className="text-3xl font-bold text-gray-900 mt-3 tracking-tight">
                                            {stat.value}
                                        </p>

                                        {stat.change !== '0' && (
                                            <p
                                                className={cn(
                                                    "text-xs mt-3 font-medium",
                                                    stat.changeType === 'increase'
                                                        ? 'text-emerald-600'
                                                        : 'text-rose-600'
                                                )}
                                            >
                                                {stat.change} من الشهر الماضي
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className={cn(
                                            "p-4 rounded-xl transition-transform duration-300 group-hover:scale-110",
                                            getColorClasses(stat.color)
                                        )}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Contracts */}
                <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            آخر العقود
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-3">
                            {recentContracts.map((contract) => (
                                <div
                                    key={contract.id}
                                    className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                                            {contract.client}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {contract.type} · {contract.number}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {contract.date}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Office Info */}
                <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            معلومات المكتب
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-500">اسم المكتب</p>
                                <p className="font-medium text-gray-900">
                                    {office?.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            <div>
                                <p className="text-sm text-gray-500">حالة الاشتراك</p>
                               
                                    {office?.subscription_status === 'active' ? 'نشط' : 'غير نشط'}
                            </div>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
