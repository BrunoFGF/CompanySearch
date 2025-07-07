import type { Company } from '../types/company';

interface CompanyCardProps {
    company: Company;
    onView?: (id: number) => void;
    onEdit?: (company: Company) => void;
    onDelete?: (company: Company) => void;
    showActions?: boolean;
}

export function CompanyCard({
                                company,
                                onView,
                                onEdit,
                                onDelete,
                                showActions = false
                            }: CompanyCardProps) {
    return (
        <div className="company-card">
            <div className="company-card__header">
                <h3 className="company-card__title">{company.name}</h3>
                <span className="company-card__id">ID: {company.id}</span>
            </div>

            <div className="company-card__content">
                <div className="company-card__section">
                    <h4 className="company-card__section-title">Direcciones</h4>
                    <div className="company-card__tags">
                        {company.addresses.map((address, index) => (
                            <span key={index} className="company-card__tag company-card__tag--address">
                                {address}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="company-card__section">
                    <h4 className="company-card__section-title">Países</h4>
                    <div className="company-card__tags">
                        {company.countries.map((country, index) => (
                            <span key={index} className="company-card__tag company-card__tag--country">
                                {country}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

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

                    {showActions && onEdit && (
                        <button
                            onClick={() => onEdit(company)}
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