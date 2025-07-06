import { API_CONFIG, DEFAULT_HEADERS } from '../config/api';
import {PAGINATION} from "../constants";
import type {
    Company,
    CompanySearchResponse,
    CompanyNamesSearchResponse,
    CompanySearchRequest,
    CreateCompanyDto,
    UpdateCompanyDto,
} from '../types/company';

class CompanyService {
    private baseUrl = API_CONFIG.BASE_URL;

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            headers: DEFAULT_HEADERS,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async searchCompanies(params: CompanySearchRequest): Promise<CompanySearchResponse> {
        const searchParams = new URLSearchParams();

        if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

        const endpoint = `${API_CONFIG.ENDPOINTS.search}?${searchParams.toString()}`;
        return this.request<CompanySearchResponse>(endpoint);
    }

    async searchCompanyNames(params: CompanySearchRequest): Promise<CompanyNamesSearchResponse> {
        const searchParams = new URLSearchParams();

        if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

        const endpoint = `${API_CONFIG.ENDPOINTS.searchNames}?${searchParams.toString()}`;
        return this.request<CompanyNamesSearchResponse>(endpoint);
    }

    async getAllCompanies(page = 1, pageSize = PAGINATION.DEFAULT_PAGE_SIZE): Promise<CompanySearchResponse> {
        const searchParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        const endpoint = `${API_CONFIG.ENDPOINTS.companies}?${searchParams.toString()}`;
        return this.request<CompanySearchResponse>(endpoint);
    }

    async getCompanyById(id: number): Promise<Company> {
        const endpoint = `${API_CONFIG.ENDPOINTS.companies}/${id}`;
        return this.request<Company>(endpoint);
    }

    async createCompany(company: CreateCompanyDto): Promise<Company> {
        return this.request<Company>(API_CONFIG.ENDPOINTS.companies, {
            method: 'POST',
            body: JSON.stringify(company),
        });
    }

    async updateCompany(id: number, company: UpdateCompanyDto): Promise<Company> {
        const endpoint = `${API_CONFIG.ENDPOINTS.companies}/${id}`;
        return this.request<Company>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(company),
        });
    }

    async deleteCompany(id: number): Promise<void> {
        const endpoint = `${API_CONFIG.ENDPOINTS.companies}/${id}`;
        return this.request<void>(endpoint, {
            method: 'DELETE',
        });
    }
}

export const companyService = new CompanyService();