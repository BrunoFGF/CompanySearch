import { useState } from 'react';
import type { SearchFilters } from '../types/company';

interface SearchFormProps {
    onSearch: (filters: SearchFilters) => void;
    isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'all' | 'names'>('all');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ searchTerm: searchTerm.trim(), searchType });
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch({ searchTerm: '', searchType });
    };

    return (
        <div className="search-form">
            <form onSubmit={handleSubmit} className="search-form__container">
                <div className="search-form__input-group">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, dirección o país..."
                        className="search-form__input"
                        disabled={isLoading}
                    />

                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as 'all' | 'names')}
                        className="search-form__select"
                        disabled={isLoading}
                    >
                        <option value="all">Información completa</option>
                        <option value="names">Solo nombres</option>
                    </select>
                </div>

                <div className="search-form__buttons">
                    <button
                        type="submit"
                        className="search-form__button search-form__button--primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Buscando...' : 'Buscar'}
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="search-form__button search-form__button--secondary"
                        disabled={isLoading}
                    >
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
}