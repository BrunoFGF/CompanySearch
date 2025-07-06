import { useState, useCallback } from 'react';
import { companyService } from '../services/companyService';
import type {
    Company,
    CompanyName,
    SearchFilters,
    PaginationInfo,
    CompanySearchResponse,
    CompanyNamesSearchResponse
} from '../types/company';
import { API_CONFIG } from '../config/api';

interface UseCompaniesState {
    companies: Company[];
    companyNames: CompanyName[];
    pagination: PaginationInfo;
    isLoading: boolean;
    error: string | null;
}

export function useCompanies() {
    const [state, setState] = useState<UseCompaniesState>({
        companies: [],
        companyNames: [],
        pagination: {
            currentPage: 1,
            pageSize: API_CONFIG.DEFAULT_PAGE_SIZE,
            totalPages: 0,
            totalCount: 0,
        },
        isLoading: false,
        error: null,
    });

    const updatePagination = useCallback((
        response: CompanySearchResponse | CompanyNamesSearchResponse
    ) => {
        return {
            currentPage: response.page,
            pageSize: response.pageSize,
            totalPages: response.totalPages,
            totalCount: response.totalCount,
        };
    }, []);

    const searchCompanies = useCallback(async (
        filters: SearchFilters,
        page = 1,
        pageSize = API_CONFIG.DEFAULT_PAGE_SIZE
    ) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const params = {
                searchTerm: filters.searchTerm || undefined,
                page,
                pageSize,
            };

            if (filters.searchType === 'names') {
                const response = await companyService.searchCompanyNames(params);
                setState(prev => ({
                    ...prev,
                    companyNames: response.companies,
                    companies: [],
                    pagination: updatePagination(response),
                    isLoading: false,
                }));
            } else {
                const response = await companyService.searchCompanies(params);
                setState(prev => ({
                    ...prev,
                    companies: response.companies,
                    companyNames: [],
                    pagination: updatePagination(response),
                    isLoading: false,
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
            }));
        }
    }, [updatePagination]);

    const loadAllCompanies = useCallback(async (
        page = 1,
        pageSize = API_CONFIG.DEFAULT_PAGE_SIZE
    ) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await companyService.getAllCompanies(page, pageSize);
            setState(prev => ({
                ...prev,
                companies: response.companies,
                companyNames: [],
                pagination: updatePagination(response),
                isLoading: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
            }));
        }
    }, [updatePagination]);

    const getCompanyById = useCallback(async (id: number): Promise<Company | null> => {
        try {
            return await companyService.getCompanyById(id);
        } catch (error) {
            console.error('Error loading company:', error);
            return null;
        }
    }, []);

    const changePage = useCallback((newPage: number, filters?: SearchFilters) => {
        const currentPageSize = state.pagination.pageSize;
        if (filters) {
            searchCompanies(filters, newPage, currentPageSize);
        } else {
            loadAllCompanies(newPage, currentPageSize);
        }
    }, [searchCompanies, loadAllCompanies, state.pagination.pageSize]);

    const changePageSize = useCallback((newPageSize: number, filters?: SearchFilters) => {
        if (filters) {
            searchCompanies(filters, 1, newPageSize);
        } else {
            loadAllCompanies(1, newPageSize);
        }
    }, [searchCompanies, loadAllCompanies]);

    return {
        ...state,
        searchCompanies,
        loadAllCompanies,
        getCompanyById,
        changePage,
        changePageSize,
    };
}