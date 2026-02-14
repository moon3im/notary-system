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
        const response = await api.post(this.baseUrl, data);
        return response.data.data.template;
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