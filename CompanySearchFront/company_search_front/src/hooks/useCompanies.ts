import { useState, useCallback } from 'react';
import { companyService } from '../services/companyService';
import type {
    Company,
    SearchFilters,
    PaginationInfo,
    CompanySearchResponse,
    CompanySearchRequest
} from '../types/company';
import { PAGINATION } from '../constants';

interface UseCompaniesState {
    companies: Company[];
    pagination: PaginationInfo;
    isLoading: boolean;
    error: string | null;
}

export function useCompanies() {
    const [state, setState] = useState<UseCompaniesState>({
        companies: [],
        pagination: {
            currentPage: 1,
            pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
            totalPages: 0,
            totalCount: 0,
        },
        isLoading: false,
        error: null,
    });

    const updatePagination = useCallback((response: CompanySearchResponse) => {
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
        pageSize = PAGINATION.DEFAULT_PAGE_SIZE
    ) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const params: CompanySearchRequest = {
                searchTerm: filters.searchTerm || undefined,
                nameFilter: filters.nameFilter || undefined,
                addressFilter: filters.addressFilter || undefined,
                countryFilter: filters.countryFilter || undefined,
                page,
                pageSize,
            };

            const response = await companyService.searchCompanies(params);
            setState(prev => ({
                ...prev,
                companies: response.companies,
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

    const loadAllCompanies = useCallback(async (
        page = 1,
        pageSize = PAGINATION.DEFAULT_PAGE_SIZE
    ) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await companyService.getAllCompanies(page, pageSize);
            setState(prev => ({
                ...prev,
                companies: response.companies,
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