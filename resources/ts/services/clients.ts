// resources/ts/services/clients.ts
import api from './api';
import { Client, CreateClientDto, UpdateClientDto, ClientFilters, ClientsResponse } from '@/pages/clients/types/types';

class ClientsService {
    async getClients(filters?: ClientFilters): Promise<ClientsResponse> {
        const response = await api.get('/v1/clients', { params: filters });
        return response.data.data;
    }

    async getClientById(id: string): Promise<Client> {
        const response = await api.get(`/v1/clients/${id}`);
        return response.data.data.client;
    }

    async createClient(data: CreateClientDto): Promise<Client> {
        const response = await api.post('/v1/clients', data);
        return response.data.data.client;
    }

    async updateClient(id: string, data: UpdateClientDto): Promise<Client> {
        const response = await api.put(`/v1/clients/${id}`, data);
        return response.data.data.client;
    }

    async deleteClient(id: string): Promise<void> {
        await api.delete(`/v1/clients/${id}`);
    }
}

export default new ClientsService();