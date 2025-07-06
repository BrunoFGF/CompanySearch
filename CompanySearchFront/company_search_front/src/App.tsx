import { useEffect, useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { CompanyCard } from './components/CompanyCard';
import { Pagination } from './components/Pagination';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useCompanies } from './hooks/useCompanies';
import type { SearchFilters } from './types/company';
import './App.css';

function App() {
    const {
        companies,
        companyNames,
        pagination,
        isLoading,
        error,
        searchCompanies,
        loadAllCompanies,
        changePage,
        changePageSize,
    } = useCompanies();

    const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

    useEffect(() => {
        loadAllCompanies();
    }, [loadAllCompanies]);

    const handleSearch = (filters: SearchFilters) => {
        if (filters.searchTerm.trim()) {
            setCurrentFilters(filters);
            searchCompanies(filters);
        } else {
            setCurrentFilters(null);
            loadAllCompanies();
        }
    };

    const handlePageChange = (page: number) => {
        changePage(page, currentFilters || undefined);
    };

    const handlePageSizeChange = (pageSize: number) => {
        changePageSize(pageSize, currentFilters || undefined);
    };

    const handleRetry = () => {
        if (currentFilters) {
            searchCompanies(currentFilters);
        } else {
            loadAllCompanies();
        }
    };

    const hasResults = companies.length > 0 || companyNames.length > 0;
    const showingNames = companyNames.length > 0;

    return (
        <div className="app">
            <header className="app__header">
                <div className="app__container">
                    <h1 className="app__title">🏢 Buscador de Compañías</h1>
                    <p className="app__subtitle">
                        Encuentra compañías por nombre, dirección o país
                    </p>
                </div>
            </header>

            <main className="app__main">
                <div className="app__container">
                    <SearchForm onSearch={handleSearch} isLoading={isLoading} />

                    {error && (
                        <ErrorMessage message={error} onRetry={handleRetry} />
                    )}

                    {isLoading && (
                        <div className="app__loading">
                            <LoadingSpinner size="large" text="Buscando compañías..." />
                        </div>
                    )}

                    {!isLoading && !error && hasResults && (
                        <div className="app__results">
                            <div className="app__results-header">
                                <h2 className="app__results-title">
                                    {currentFilters
                                        ? `Resultados para "${currentFilters.searchTerm}"`
                                        : 'Todas las compañías'
                                    }
                                </h2>
                                <p className="app__results-info">
                                    Mostrando {showingNames ? 'nombres' : 'información completa'}
                                </p>
                            </div>

                            <div className="app__companies-grid">
                                {showingNames
                                    ? companyNames.map((company) => (
                                        <CompanyCard
                                            key={company.id}
                                            company={company}
                                            type="name"
                                        />
                                    ))
                                    : companies.map((company) => (
                                        <CompanyCard
                                            key={company.id}
                                            company={company}
                                            type="full"
                                        />
                                    ))
                                }
                            </div>

                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                isLoading={isLoading}
                            />
                        </div>
                    )}

                    {!isLoading && !error && !hasResults && currentFilters && (
                        <div className="app__no-results">
                            <div className="app__no-results-icon">🔍</div>
                            <h3 className="app__no-results-title">No se encontraron resultados</h3>
                            <p className="app__no-results-text">
                                No hay compañías que coincidan con "{currentFilters.searchTerm}".
                                Intenta con otros términos de búsqueda.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="app__footer">
                <div className="app__container">
                    <p className="app__footer-text">
                        Buscador de Compañías
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;