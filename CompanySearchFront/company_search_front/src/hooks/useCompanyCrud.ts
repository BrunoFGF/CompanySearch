import { useState, useCallback } from 'react';
import { companyService } from '../services/companyService';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';

interface UseCompanyCrudState {
    isLoading: boolean;
    error: string | null;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export function useCompanyCrud() {
    const [state, setState] = useState<UseCompanyCrudState>({
        isLoading: false,
        error: null,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
    });

    const setLoading = useCallback((type: keyof UseCompanyCrudState, value: boolean) => {
        setState(prev => ({ ...prev, [type]: value, error: null }));
    }, []);

    const setError = useCallback((error: string) => {
        setState(prev => ({
            ...prev,
            error,
            isLoading: false,
            isCreating: false,
            isUpdating: false,
            isDeleting: false
        }));
    }, []);

    const createCompany = useCallback(async (companyData: CreateCompanyDto): Promise<Company | null> => {
        setLoading('isCreating', true);
        try {
            const newCompany = await companyService.createCompany(companyData);
            setState(prev => ({ ...prev, isCreating: false, error: null }));
            return newCompany;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al crear la compañía');
            return null;
        }
    }, [setLoading, setError]);

    const updateCompany = useCallback(async (id: number, companyData: UpdateCompanyDto): Promise<Company | null> => {
        setLoading('isUpdating', true);
        try {
            const updatedCompany = await companyService.updateCompany(id, companyData);
            setState(prev => ({ ...prev, isUpdating: false, error: null }));
            return updatedCompany;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al actualizar la compañía');
            return null;
        }
    }, [setLoading, setError]);

    const deleteCompany = useCallback(async (id: number): Promise<boolean> => {
        setLoading('isDeleting', true);
        try {
            await companyService.deleteCompany(id);
            setState(prev => ({ ...prev, isDeleting: false, error: null }));
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al eliminar la compañía');
            return false;
        }
    }, [setLoading, setError]);

    const getCompanyById = useCallback(async (id: number): Promise<Company | null> => {
        setLoading('isLoading', true);
        try {
            const company = await companyService.getCompanyById(id);
            setState(prev => ({ ...prev, isLoading: false, error: null }));
            return company;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar la compañía');
            return null;
        }
    }, [setLoading, setError]);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        ...state,
        createCompany,
        updateCompany,
        deleteCompany,
        getCompanyById,
        clearError,
    };
}