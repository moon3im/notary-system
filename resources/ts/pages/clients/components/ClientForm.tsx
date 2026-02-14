import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    User, 
    IdCard, 
    Calendar, 
    MapPin, 
    Heart, 
    Phone, 
    Home,
    Briefcase,
    Globe,
    FileText,
    Award,
    Loader2 
} from 'lucide-react';

import { 
    clientSchema, 
    ClientFormData, 
    maritalStatusOptions,
    nationalityOptions,
    professionOptions 
} from '../types/schema';
import { Client } from '../types/types';

interface ClientFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ClientFormData) => Promise<void>;
    client?: Client | null;
    loading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
    open,
    onOpenChange,
    onSubmit,
    client,
    loading = false,
}) => {
    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            father_name: '',
            mother_name: '',
            nationality: 'جزائري',
            profession: '',
            national_id: '',
            id_card_number: '',
            id_issue_date: '',
            id_issuing_authority: '',
            birth_date: '',
            birth_place: '',
            birth_certificate: '',
            marital_status: undefined,
            address: '',
            phone: '',
        },
    });

    // تعبئة النموذج عند التعديل
    useEffect(() => {
        if (client) {
            form.reset({
                first_name: client.first_name,
                last_name: client.last_name,
                father_name: client.father_name || '',
                mother_name: client.mother_name || '',
                nationality: client.nationality || 'جزائري',
                profession: client.profession || '',
                national_id: client.national_id,
                id_card_number: client.id_card_number || '',
                id_issue_date: client.id_issue_date || '',
                id_issuing_authority: client.id_issuing_authority || '',
                birth_date: client.birth_date || '',
                birth_place: client.birth_place || '',
                birth_certificate: client.birth_certificate || '',
                marital_status: client.marital_status || undefined,
                address: client.address || '',
                phone: client.phone || '',
            });
        } else {
            form.reset();
        }
    }, [client, form]);

    const handleSubmit = async (data: ClientFormData) => {
        await onSubmit(data);
        if (!client) {
            form.reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl">
                        {client ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 py-4">
                            <Tabs defaultValue="personal" dir="rtl" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 mb-4">
                                    <TabsTrigger value="personal" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>بيانات شخصية</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="identity" className="flex items-center gap-2">
                                        <IdCard className="h-4 w-4" />
                                        <span>وثائق الهوية</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="birth" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>معلومات الميلاد</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="contact" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>معلومات الاتصال</span>
                                    </TabsTrigger>
                                </TabsList>

                                {/* Tab 1: البيانات الشخصية */}
                                <TabsContent value="personal" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="first_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الاسم الأول *</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="أدخل الاسم الأول" 
                                                            {...field} 
                                                            disabled={loading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="last_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>اللقب *</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="أدخل اللقب" 
                                                            {...field} 
                                                            disabled={loading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="father_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>اسم الأب</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="أدخل اسم الأب" 
                                                            {...field} 
                                                            value={field.value || ''}
                                                            disabled={loading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="mother_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>اسم الأم</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="أدخل اسم الأم" 
                                                            {...field} 
                                                            value={field.value || ''}
                                                            disabled={loading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="nationality"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الجنسية</FormLabel>
                                                    <Select 
                                                        onValueChange={field.onChange} 
                                                        value={field.value || ''}
                                                        disabled={loading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="اختر الجنسية" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {nationalityOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="profession"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>المهنة</FormLabel>
                                                    <Select 
                                                        onValueChange={field.onChange} 
                                                        value={field.value || ''}
                                                        disabled={loading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="اختر المهنة" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {professionOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="marital_status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الحالة الاجتماعية</FormLabel>
                                                <Select 
                                                    onValueChange={field.onChange} 
                                                    value={field.value || ''}
                                                    disabled={loading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="اختر الحالة الاجتماعية" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {maritalStatusOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>

                                {/* Tab 2: وثائق الهوية */}
                                <TabsContent value="identity" className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="national_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>رقم التعريف الوطني *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="أدخل رقم التعريف الوطني" 
                                                        {...field} 
                                                        disabled={loading}
                                                        dir="ltr"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="id_card_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>رقم بطاقة التعريف</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="أدخل رقم بطاقة التعريف" 
                                                            {...field} 
                                                            value={field.value || ''}
                                                            disabled={loading}
                                                            dir="ltr"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="id_issue_date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>تاريخ الإصدار</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="date" 
                                                            {...field} 
                                                            value={field.value || ''}
                                                            disabled={loading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="id_issuing_authority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>جهة الإصدار</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="مثال: بلدية المسيلة" 
                                                        {...field} 
                                                        value={field.value || ''}
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>

                                {/* Tab 3: معلومات الميلاد */}
                                <TabsContent value="birth" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="birth_date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>تاريخ الميلاد</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="date" 
                                                            {...field} 
                                                            value={field.value || ''}
                                                            disabled={loading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="birth_place"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>مكان الميلاد</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="أدخل مكان الميلاد" 
                                                            {...field} 
                                                            value={field.value || ''}
                                                            disabled={loading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="birth_certificate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>رقم شهادة الميلاد</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="أدخل رقم شهادة الميلاد" 
                                                        {...field} 
                                                        value={field.value || ''}
                                                        disabled={loading}
                                                        dir="ltr"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>

                                {/* Tab 4: معلومات الاتصال */}
                                <TabsContent value="contact" className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>رقم الهاتف</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="أدخل رقم الهاتف" 
                                                        {...field} 
                                                        value={field.value || ''}
                                                        disabled={loading}
                                                        dir="ltr"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>العنوان</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="أدخل العنوان بالكامل" 
                                                        {...field} 
                                                        value={field.value || ''}
                                                        disabled={loading}
                                                        rows={4}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>
                        </ScrollArea>

                        <DialogFooter className="px-6 py-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                إلغاء
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="gap-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {client ? 'تحديث البيانات' : 'إضافة العميل'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};