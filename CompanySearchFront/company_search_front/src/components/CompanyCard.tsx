import type { Company, CompanyName } from '../types/company';

interface CompanyCardProps {
    company: Company | CompanyName;
    type: 'full' | 'name';
    onView?: (id: number) => void;
}

export function CompanyCard({ company, type, onView }: CompanyCardProps) {
    const isFullCompany = (comp: Company | CompanyName): comp is Company => {
        return 'addresses' in comp && 'countries' in comp;
    };

    return (
        <div className="company-card">
            <div className="company-card__header">
                <h3 className="company-card__title">{company.name}</h3>
                <span className="company-card__id">ID: {company.id}</span>
            </div>

            {type === 'full' && isFullCompany(company) && (
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
            )}

            {onView && (
                <div className="company-card__actions">
                    <button
                        onClick={() => onView(company.id)}
                        className="company-card__button"
                    >
                        Ver detalles
                    </button>
                </div>
            )}
        </div>
    );
}