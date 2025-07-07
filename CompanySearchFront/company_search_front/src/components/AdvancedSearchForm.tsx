import { useState } from 'react';
import type { SearchFilters } from '../types/company';

interface AdvancedSearchFormProps {
    onSearch: (filters: SearchFilters) => void;
    isLoading?: boolean;
}

export function AdvancedSearchForm({ onSearch, isLoading = false }: AdvancedSearchFormProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [addressFilter, setAddressFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

            onSearch({
                searchTerm: searchTerm.trim(),
                nameFilter: nameFilter.trim(),
                addressFilter: addressFilter.trim(),
                countryFilter: countryFilter.trim()
            });
    };

    const handleClear = () => {
        setSearchTerm('');
        setNameFilter('');
        setAddressFilter('');
        setCountryFilter('');
        onSearch({
            searchTerm: '',
            nameFilter: '',
            addressFilter: '',
            countryFilter: ''
        });
    };

    const hasAnyFilter = () => {
        return searchTerm.trim() || nameFilter.trim() || addressFilter.trim() || countryFilter.trim();
    };

    return (
        <div className="advanced-search-form">
            <div className="advanced-search-form__header">
                <h3 className="advanced-search-form__title">🔍 Búsqueda de Compañías</h3>
            </div>

            <form onSubmit={handleSubmit} className="advanced-search-form__form">
                {/* Búsqueda general */}
                <div className="advanced-search-form__section">
                    <h4 className="advanced-search-form__section-title">Búsqueda General</h4>
                    <div className="advanced-search-form__field">
                        <label className="advanced-search-form__label">
                            Buscar en todos los campos
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="advanced-search-form__input"
                            placeholder="Texto que aparezca en nombre, dirección o país..."
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Filtros específicos */}
                <div className="advanced-search-form__section">
                    <h4 className="advanced-search-form__section-title">Filtros Específicos</h4>

                    <div className="advanced-search-form__filters-grid">
                        <div className="advanced-search-form__field">
                            <label className="advanced-search-form__label">
                                📝 Nombre de la compañía
                            </label>
                            <input
                                type="text"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="advanced-search-form__input"
                                placeholder="Ej: Microsoft, Apple..."
                                disabled={isLoading}
                            />
                        </div>

                        <div className="advanced-search-form__field">
                            <label className="advanced-search-form__label">
                                📍 Dirección
                            </label>
                            <input
                                type="text"
                                value={addressFilter}
                                onChange={(e) => setAddressFilter(e.target.value)}
                                className="advanced-search-form__input"
                                placeholder="Ej: Alborada, Calle, 123..."
                                disabled={isLoading}
                            />
                        </div>

                        <div className="advanced-search-form__field">
                            <label className="advanced-search-form__label">
                                🌍 País
                            </label>
                            <input
                                type="text"
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="advanced-search-form__input"
                                placeholder="Ej: España, México, USA..."
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <div className="advanced-search-form__actions">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="advanced-search-form__button advanced-search-form__button--secondary"
                        disabled={isLoading}
                    >
                        🗑️ Limpiar
                    </button>

                    <button
                        type="submit"
                        className="advanced-search-form__button advanced-search-form__button--primary"
                        disabled={isLoading || !hasAnyFilter()}
                    >
                        {isLoading ? '⏳ Buscando...' : '🔍 Buscar'}
                    </button>
                </div>

                {hasAnyFilter() && (
                    <div className="advanced-search-form__active-filters">
                        <h5 className="advanced-search-form__active-title">Filtros activos:</h5>
                        <div className="advanced-search-form__tags">
                            {searchTerm && (
                                <span className="advanced-search-form__tag advanced-search-form__tag--general">
                                    General: "{searchTerm}"
                                </span>
                            )}
                            {nameFilter && (
                                <span className="advanced-search-form__tag advanced-search-form__tag--name">
                                    Nombre: "{nameFilter}"
                                </span>
                            )}
                            {addressFilter && (
                                <span className="advanced-search-form__tag advanced-search-form__tag--address">
                                    Dirección: "{addressFilter}"
                                </span>
                            )}
                            {countryFilter && (
                                <span className="advanced-search-form__tag advanced-search-form__tag--country">
                                    País: "{countryFilter}"
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}