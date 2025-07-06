import { useState } from 'react';
import type { SearchFilters } from '../types/company';

export function useSearchState() {
    const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

    const setFilters = (filters: SearchFilters) => {
        setCurrentFilters(filters);
    };

    const clearFilters = () => {
        setCurrentFilters(null);
    };

    const hasActiveFilters = () => {
        return currentFilters !== null && currentFilters.searchTerm.trim() !== '';
    };

    return {
        currentFilters,
        setFilters,
        clearFilters,
        hasActiveFilters,
    };
}