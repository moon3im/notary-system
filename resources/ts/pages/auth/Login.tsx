import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Scale, Shield } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login({ email, password });
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل تسجيل الدخول');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <Scale className="h-10 w-10 text-slate-700" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        منصة التوثيق
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        نظام إدارة عقود الموثقين
                    </p>
                </div>

                {/* Card */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-lg text-gray-800">
                            تسجيل الدخول
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-sm">
                            أدخل بيانات الدخول الخاصة بك
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    dir="ltr"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">كلمة المرور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    dir="ltr"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white"
                                disabled={loading}
                            >
                                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                            </Button>

                            <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
                                <Shield className="h-4 w-4 text-green-600" />
                                اتصال آمن ومشفر
                            </div>

                        </form>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-gray-400">
                    هذه المنصة مخصصة للموثقين المعتمدين فقط
                </p>
            </div>
        </div>
    );
}
