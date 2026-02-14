import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        منصة التوثيق
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        أدخل بيانات الدخول الخاصة بمكتبك
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                                البريد الإلكتروني
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="notaire@exemple.dz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full"
                                dir="ltr"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                كلمة المرور
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full"
                                dir="ltr"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⚪</span>
                                    جاري تسجيل الدخول...
                                </span>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        <p>هذه المنصة مخصصة للموثقين المسجلين فقط</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}