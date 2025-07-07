import { CompanyCard } from './CompanyCard';
import { Pagination } from './Pagination';
import { CompanyManager } from './CompanyManager';
import type { Company, SearchFilters, PaginationInfo } from '../types/company';

interface CompanyListProps {
    companies: Company[];
    currentFilters: SearchFilters | null;
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onCompanyChange?: () => void;
    isLoading: boolean;
}

export function CompanyList({
                                companies,
                                currentFilters,
                                pagination,
                                onPageChange,
                                onPageSizeChange,
                                onCompanyChange,
                                isLoading
                            }: CompanyListProps) {
    const getResultsTitle = () => {
        if (currentFilters) {
            const activeFilters = [
                currentFilters.searchTerm,
                currentFilters.nameFilter,
                currentFilters.addressFilter,
                currentFilters.countryFilter
            ].filter(filter => filter.trim()).join(', ');

            return `Resultados para: ${activeFilters}`;
        }
        return 'Todas las compañías';
    };

    const handleEditCompany = (company: Company) => {
        const event = new CustomEvent('editCompany', { detail: company });
        window.dispatchEvent(event);
    };

    const handleDeleteCompany = (company: Company) => {
        const event = new CustomEvent('deleteCompany', { detail: company });
        window.dispatchEvent(event);
    };

    return (
        <>
            <div className="app__results">
                <div className="app__results-header">
                    <h2 className="app__results-title">{getResultsTitle()}</h2>
                    <p className="app__results-info">Información completa de las compañías</p>
                </div>

                <div className="app__companies-container">
                    <div className="app__companies-scroll">
                        <div className="app__companies-grid">
                            {companies.map((company) => (
                                <CompanyCard
                                    key={company.id}
                                    company={company}
                                    showActions={true}
                                    onEdit={handleEditCompany}
                                    onDelete={handleDeleteCompany}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="app__pagination-section">
                        <Pagination
                            pagination={pagination}
                            onPageChange={onPageChange}
                            onPageSizeChange={onPageSizeChange}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>

            <CompanyManager onCompanyChange={onCompanyChange} />
        </>
    );
}