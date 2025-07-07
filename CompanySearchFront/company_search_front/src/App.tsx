import { useEffect } from 'react';
import { AdvancedSearchForm } from './components/AdvancedSearchForm';
import { CompanyList } from './components/CompanyList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ToastProvider } from './components/ToastProvider';
import { useCompanies } from './hooks/useCompanies';
import { useSearchState } from './hooks/useSearchState';
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

    const { currentFilters, setFilters, clearFilters } = useSearchState();

    useEffect(() => {
        loadAllCompanies();
    }, [loadAllCompanies]);

    const handleSearch = (filters: SearchFilters) => {
        const hasAnyFilter = filters.searchTerm.trim() ||
            filters.nameFilter.trim() ||
            filters.addressFilter.trim() ||
            filters.countryFilter.trim();

        if (hasAnyFilter) {
            setFilters(filters);
            searchCompanies(filters);
        } else {
            clearFilters();
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

    const handleCompanyChange = () => {
        // Recargar datos después de crear, editar o eliminar
        if (currentFilters) {
            searchCompanies(currentFilters);
        } else {
            loadAllCompanies();
        }
    };

    const hasResults = companies.length > 0 || companyNames.length > 0;
    const showingNames = companyNames.length > 0;

    return (
        <ToastProvider>
            <div className="app">
                <Header />

                <main className="app__main">
                    <div className="app__container">
                        <div className="app__search-section">
                            <AdvancedSearchForm onSearch={handleSearch} isLoading={isLoading} />
                            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
                        </div>

                        <div className="app__content">
                            {isLoading ? (
                                <LoadingContent />
                            ) : error ? null : hasResults ? (
                                <CompanyList
                                    companies={companies}
                                    companyNames={companyNames}
                                    showingNames={showingNames}
                                    currentFilters={currentFilters}
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                    onCompanyChange={handleCompanyChange}
                                    isLoading={isLoading}
                                />
                            ) : currentFilters ? (
                                <NoResults />
                            ) : null}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </ToastProvider>
    );
}

// Componentes auxiliares para mejor organización
function Header() {
    return (
        <header className="app__header">
            <div className="app__container">
                <h1 className="app__title">🏢 Buscador de Compañías</h1>
                <p className="app__subtitle">
                    Encuentra compañías por nombre, dirección o país
                </p>
            </div>
        </header>
    );
}

function LoadingContent() {
    return (
        <div className="app__loading">
            <LoadingSpinner size="large" text="Buscando compañías..." />
        </div>
    );
}

function NoResults() {
    return (
        <div className="app__no-results">
            <div className="app__no-results-icon">🔍</div>
            <h3 className="app__no-results-title">No se encontraron resultados</h3>
            <p className="app__no-results-text">
                No hay compañías que coincidan con los filtros aplicados.
                Intenta con otros términos de búsqueda.
            </p>
        </div>
    );
}

function Footer() {
    return (
        <footer className="app__footer">
            <div className="app__container">
                <p className="app__footer-text">
                    Buscador de Compañías
                </p>
            </div>
        </footer>
    );
}

export default App;