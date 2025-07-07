import { CompanyCard } from './CompanyCard';
import { Pagination } from './Pagination';
import { CompanyManager } from './CompanyManager';
import type { Company, CompanyName, SearchFilters, PaginationInfo } from '../types/company';

interface CompanyListProps {
    companies: Company[];
    companyNames: CompanyName[];
    showingNames: boolean;
    currentFilters: SearchFilters | null;
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onCompanyChange?: () => void;
    isLoading: boolean;
}

export function CompanyList({
                                companies,
                                companyNames,
                                showingNames,
                                currentFilters,
                                pagination,
                                onPageChange,
                                onPageSizeChange,
                                onCompanyChange,
                                isLoading
                            }: CompanyListProps) {
    const getResultsTitle = () => {
        if (currentFilters) {
            return `Resultados para "${currentFilters.searchTerm}"`;
        }
        return 'Todas las compañías';
    };

    const getResultsInfo = () => {
        return `Mostrando ${showingNames ? 'nombres' : 'información completa'}`;
    };

    const handleEditCompany = (company: Company) => {
        const event = new CustomEvent('editCompany', { detail: company });
        window.dispatchEvent(event);
    };

    const handleDeleteCompany = (company: Company | CompanyName) => {
        const event = new CustomEvent('deleteCompany', { detail: company });
        window.dispatchEvent(event);
    };

    return (
        <>
            <div className="app__results">
                <div className="app__results-header">
                    <h2 className="app__results-title">{getResultsTitle()}</h2>
                    <p className="app__results-info">{getResultsInfo()}</p>
                </div>

                <div className="app__companies-container">
                    <div className="app__companies-scroll">
                        <div className="app__companies-grid">
                            {showingNames
                                ? companyNames.map((company) => (
                                    <CompanyCard
                                        key={company.id}
                                        company={company}
                                        type="name"
                                        showActions={true}
                                        onDelete={handleDeleteCompany}
                                    />
                                ))
                                : companies.map((company) => (
                                    <CompanyCard
                                        key={company.id}
                                        company={company}
                                        type="full"
                                        showActions={true}
                                        onEdit={handleEditCompany}
                                        onDelete={handleDeleteCompany}
                                    />
                                ))
                            }
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