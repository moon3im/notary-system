import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Client, ClientFilters, CreateClientDto, UpdateClientDto } from '../types/types';
import clientsService from '@/services/clients';

// مفتاح Query للـ React Query
export const CLIENTS_QUERY_KEY = 'clients';

export const useClients = (filters?: ClientFilters) => {
    const queryClient = useQueryClient();

    // Query لجلب العملاء
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: [CLIENTS_QUERY_KEY, filters],
        queryFn: () => clientsService.getClients(filters),
        staleTime: 5 * 60 * 1000, // 5 دقائق
    });

    // Mutation لإنشاء عميل
    const createMutation = useMutation({
        mutationFn: (data: CreateClientDto) => clientsService.createClient(data),
        onSuccess: () => {
            toast.success('تم إضافة العميل بنجاح');
            queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'فشل في إضافة العميل');
        },
    });

    // Mutation لتحديث عميل
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) => 
            clientsService.updateClient(id, data),
        onSuccess: () => {
            toast.success('تم تحديث بيانات العميل بنجاح');
            queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'فشل في تحديث العميل');
        },
    });

    // Mutation لحذف عميل
    const deleteMutation = useMutation({
        mutationFn: (id: string) => clientsService.deleteClient(id),
        onSuccess: () => {
            toast.success('تم حذف العميل بنجاح');
            queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'فشل في حذف العميل');
        },
    });

    // دوال مساعدة
    const createClient = useCallback((data: CreateClientDto) => {
        return createMutation.mutateAsync(data);
    }, [createMutation]);

    const updateClient = useCallback((id: string, data: UpdateClientDto) => {
        return updateMutation.mutateAsync({ id, data });
    }, [updateMutation]);

    const deleteClient = useCallback((id: string) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);

    return {
        // البيانات
        clients: data?.data || [],
        pagination: {
            currentPage: data?.current_page || 1,
            lastPage: data?.last_page || 1,
            perPage: data?.per_page || 15,
            total: data?.total || 0,
        },
        loading: isLoading,
        error,
        
        // العمليات
        createClient,
        updateClient,
        deleteClient,
        refetch,
        
        // حالات العمليات
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};

// Hook لجلب عميل واحد
export const useClient = (id: string) => {
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true);
                const data = await clientsService.getClientById(id);
                setClient(data);
                setError(null);
            } catch (err) {
                setError(err as Error);
                toast.error('فشل في جلب بيانات العميل');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchClient();
        }
    }, [id]);

    return { 
        client, 
        loading, 
        error 
    };
};