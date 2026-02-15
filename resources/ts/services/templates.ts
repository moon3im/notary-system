import api from './api';
import { Template, CreateTemplateDto, UpdateTemplateDto, TemplateFilters } from '@/pages/templates/types/templates';

class TemplatesService {
    private readonly baseUrl = '/v1/templates';

    async getTemplates(filters?: TemplateFilters) {
        const response = await api.get(this.baseUrl, { params: filters });
        return response.data.data;
    }

    async getTemplateById(id: string): Promise<Template> {
        const response = await api.get(`${this.baseUrl}/${id}`);
        return response.data.data.template;
    }

   async createTemplate(data: CreateTemplateDto): Promise<Template> {
    console.log('🚀 [templatesService] Sending POST request to /v1/templates');
    console.log('🚀 [templatesService] Request data:', JSON.stringify(data, null, 2));
    
    try {
        const response = await api.post('/v1/templates', data);
        console.log('📦 [templatesService] Response status:', response.status);
        console.log('📦 [templatesService] Response data:', response.data);
        return response.data.data.template;
    } catch (error) {
        console.error('💥 [templatesService] Error:', error);
        if (error.response) {
            console.error('💥 [templatesService] Error response:', error.response.data);
            console.error('💥 [templatesService] Error status:', error.response.status);
        }
        throw error;
    }
}
    async updateTemplate(id: string, data: UpdateTemplateDto): Promise<Template> {
        const response = await api.put(`${this.baseUrl}/${id}`, data);
        return response.data.data.template;
    }

    async deleteTemplate(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async duplicateTemplate(id: string): Promise<Template> {
        const response = await api.post(`${this.baseUrl}/${id}/duplicate`);
        return response.data.data.template;
    }
}

export default new TemplatesService();