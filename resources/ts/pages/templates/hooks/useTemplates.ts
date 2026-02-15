import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import templatesService from '@/services/templates';
import { Template, CreateTemplateDto, UpdateTemplateDto, TemplateFilters } from '../types/templates';

export const TEMPLATES_QUERY_KEY = 'templates';

export const useTemplates = (filters?: TemplateFilters) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [TEMPLATES_QUERY_KEY, filters],
        queryFn: () => templatesService.getTemplates(filters),
    });

    const createMutation = useMutation({
    mutationFn: async (data: CreateTemplateDto) => {
        console.log('📡 [useTemplates] createMutation called with:', data);
        try {
            const result = await templatesService.createTemplate(data);
            console.log('📡 [useTemplates] createMutation success:', result);
            return result;
        } catch (error) {
            console.error('📡 [useTemplates] createMutation error:', error);
            throw error;
        }
    },
    onSuccess: (data) => {
        console.log('✅ [useTemplates] onSuccess:', data);
        toast.success('تم إنشاء القالب بنجاح');
        queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
    },
    onError: (error: any) => {
        console.error('❌ [useTemplates] onError:', error);
        console.error('❌ [useTemplates] Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'فشل في إنشاء القالب');
    },
});

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTemplateDto }) => 
            templatesService.updateTemplate(id, data),
        onSuccess: () => {
            toast.success('تم تحديث القالب بنجاح');
            queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'فشل في تحديث القالب');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => templatesService.deleteTemplate(id),
        onSuccess: () => {
            toast.success('تم حذف القالب بنجاح');
            queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'فشل في حذف القالب');
        },
    });

    const duplicateMutation = useMutation({
        mutationFn: (id: string) => templatesService.duplicateTemplate(id),
        onSuccess: () => {
            toast.success('تم نسخ القالب بنجاح');
            queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] });
        },
    });

    const createTemplate = useCallback((data: CreateTemplateDto) => 
        createMutation.mutateAsync(data), [createMutation]);

    const updateTemplate = useCallback((id: string, data: UpdateTemplateDto) => 
        updateMutation.mutateAsync({ id, data }), [updateMutation]);

    const deleteTemplate = useCallback((id: string) => 
        deleteMutation.mutateAsync(id), [deleteMutation]);

    const duplicateTemplate = useCallback((id: string) => 
        duplicateMutation.mutateAsync(id), [duplicateMutation]);

    return {
        templates: data?.data || [],
        pagination: {
            currentPage: data?.current_page || 1,
            lastPage: data?.last_page || 1,
            total: data?.total || 0,
        },
        loading: isLoading,
        error,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,
        refetch,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isDuplicating: duplicateMutation.isPending,
    };
};

export const useTemplate = (id: string) => {
    return useQuery({
        queryKey: [TEMPLATES_QUERY_KEY, id],
        queryFn: () => templatesService.getTemplateById(id),
        enabled: !!id,
    });
};