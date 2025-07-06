interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="error-message">
            <div className="error-message__icon">⚠️</div>
            <div className="error-message__content">
                <h3 className="error-message__title">Error</h3>
                <p className="error-message__text">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="error-message__button"
                    >
                        Intentar nuevamente
                    </button>
                )}
            </div>
        </div>
    );
}