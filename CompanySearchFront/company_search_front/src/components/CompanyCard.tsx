import type { Company, CompanyName } from '../types/company';

interface CompanyCardProps {
    company: Company | CompanyName;
    type: 'full' | 'name';
    onView?: (id: number) => void;
    onEdit?: (company: Company) => void;
    onDelete?: (company: Company | CompanyName) => void;
    showActions?: boolean;
}

export function CompanyCard({
                                company,
                                type,
                                onView,
                                onEdit,
                                onDelete,
                                showActions = false
                            }: CompanyCardProps) {
    const isFullCompany = (comp: Company | CompanyName): comp is Company => {
        return 'addresses' in comp && 'countries' in comp;
    };

    const fullCompany = isFullCompany(company) ? company : null;

    return (
        <div className="company-card">
            <div className="company-card__header">
                <h3 className="company-card__title">{company.name}</h3>
                <span className="company-card__id">ID: {company.id}</span>
            </div>

            {type === 'full' && fullCompany && (
                <div className="company-card__content">
                    <div className="company-card__section">
                        <h4 className="company-card__section-title">Direcciones</h4>
                        <div className="company-card__tags">
                            {fullCompany.addresses.map((address, index) => (
                                <span key={index} className="company-card__tag company-card__tag--address">
                                    {address}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="company-card__section">
                        <h4 className="company-card__section-title">Países</h4>
                        <div className="company-card__tags">
                            {fullCompany.countries.map((country, index) => (
                                <span key={index} className="company-card__tag company-card__tag--country">
                                    {country}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {(onView || showActions) && (
                <div className="company-card__actions">
                    {onView && (
                        <button
                            onClick={() => onView(company.id)}
                            className="company-card__button company-card__button--view"
                        >
                            Ver detalles
                        </button>
                    )}

                    {showActions && fullCompany && onEdit && (
                        <button
                            onClick={() => onEdit(fullCompany)}
                            className="company-card__button company-card__button--edit"
                        >
                            ✏️ Editar
                        </button>
                    )}

                    {showActions && onDelete && (
                        <button
                            onClick={() => onDelete(company)}
                            className="company-card__button company-card__button--delete"
                        >
                            🗑️ Eliminar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}