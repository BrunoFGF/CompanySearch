import { LoadingSpinner } from './LoadingSpinner';

interface DeleteConfirmationProps {
    companyName: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmation({
                                       companyName,
                                       isLoading = false,
                                       onConfirm,
                                       onCancel
                                   }: DeleteConfirmationProps) {
    return (
        <div className="delete-confirmation">
            <div className="delete-confirmation__icon">
                ⚠️
            </div>

            <div className="delete-confirmation__content">
                <h3 className="delete-confirmation__title">
                    ¿Eliminar compañía?
                </h3>

                <p className="delete-confirmation__message">
                    ¿Estás seguro de que deseas eliminar la compañía{' '}
                    <strong>"{companyName}"</strong>?
                </p>

                <p className="delete-confirmation__warning">
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div className="delete-confirmation__actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="delete-confirmation__button delete-confirmation__button--secondary"
                    disabled={isLoading}
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    className="delete-confirmation__button delete-confirmation__button--danger"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <LoadingSpinner size="small" />
                    ) : (
                        'Eliminar'
                    )}
                </button>
            </div>
        </div>
    );
}