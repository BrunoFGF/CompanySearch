import { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';

interface CompanyFormProps {
    company?: Company;
    isLoading?: boolean;
    onSubmit: (data: CreateCompanyDto | UpdateCompanyDto) => Promise<void> | void;
    onCancel: () => void;
}

export function CompanyForm({ company, isLoading = false, onSubmit, onCancel }: CompanyFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        addresses: [''],
        countries: ['']
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name,
                addresses: company.addresses.length > 0 ? company.addresses : [''],
                countries: company.countries.length > 0 ? company.countries : ['']
            });
        }
    }, [company]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        const validAddresses = formData.addresses.filter(addr => addr.trim() !== '');
        if (validAddresses.length === 0) {
            newErrors.addresses = 'Al menos una dirección es requerida';
        }

        const validCountries = formData.countries.filter(country => country.trim() !== '');
        if (validCountries.length === 0) {
            newErrors.countries = 'Al menos un país es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const cleanData = {
            name: formData.name.trim(),
            addresses: formData.addresses.filter(addr => addr.trim() !== ''),
            countries: formData.countries.filter(country => country.trim() !== '')
        };

        await onSubmit(cleanData);
    };

    const addField = (field: 'addresses' | 'countries') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeField = (field: 'addresses' | 'countries', index: number) => {
        if (formData[field].length <= 1) return;

        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateField = (field: 'addresses' | 'countries', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const isEditing = !!company;

    return (
        <div className="company-form">
            <div className="company-form__header">
                <h2 className="company-form__title">
                    {isEditing ? 'Editar Compañía' : 'Nueva Compañía'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="company-form__form">
                <div className="company-form__field">
                    <label className="company-form__label">
                        Nombre de la compañía *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`company-form__input ${errors.name ? 'company-form__input--error' : ''}`}
                        placeholder="Ingresa el nombre de la compañía"
                        disabled={isLoading}
                    />
                    {errors.name && (
                        <span className="company-form__error">{errors.name}</span>
                    )}
                </div>

                <div className="company-form__field">
                    <div className="company-form__field-header">
                        <label className="company-form__label">Direcciones *</label>
                        <button
                            type="button"
                            onClick={() => addField('addresses')}
                            className="company-form__add-button"
                            disabled={isLoading}
                        >
                            + Agregar dirección
                        </button>
                    </div>

                    {formData.addresses.map((address, index) => (
                        <div key={index} className="company-form__input-group">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => updateField('addresses', index, e.target.value)}
                                className="company-form__input"
                                placeholder={`Dirección ${index + 1}`}
                                disabled={isLoading}
                            />
                            {formData.addresses.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeField('addresses', index)}
                                    className="company-form__remove-button"
                                    disabled={isLoading}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    {errors.addresses && (
                        <span className="company-form__error">{errors.addresses}</span>
                    )}
                </div>

                <div className="company-form__field">
                    <div className="company-form__field-header">
                        <label className="company-form__label">Países *</label>
                        <button
                            type="button"
                            onClick={() => addField('countries')}
                            className="company-form__add-button"
                            disabled={isLoading}
                        >
                            + Agregar país
                        </button>
                    </div>

                    {formData.countries.map((country, index) => (
                        <div key={index} className="company-form__input-group">
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => updateField('countries', index, e.target.value)}
                                className="company-form__input"
                                placeholder={`País ${index + 1}`}
                                disabled={isLoading}
                            />
                            {formData.countries.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeField('countries', index)}
                                    className="company-form__remove-button"
                                    disabled={isLoading}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    {errors.countries && (
                        <span className="company-form__error">{errors.countries}</span>
                    )}
                </div>

                <div className="company-form__actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="company-form__button company-form__button--secondary"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="company-form__button company-form__button--primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            isEditing ? 'Actualizar' : 'Crear'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}