export interface Company {
    id: number;
    name: string;
    addresses: string[];
    countries: string[];
}

export interface CompanyName {
    id: number;
    name: string;
}

export interface CompanySearchResponse {
    companies: Company[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CompanyNamesSearchResponse {
    companies: CompanyName[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CompanySearchRequest {
    searchTerm?: string;
    page?: number;
    pageSize?: number;
}

export interface CreateCompanyDto {
    name: string;
    addresses: string[];
    countries: string[];
}

export interface UpdateCompanyDto {
    name?: string;
    addresses?: string[];
    countries?: string[];
}

export interface SearchFilters {
    searchTerm: string;
    searchType: 'all' | 'names';
}

export interface PaginationInfo {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}