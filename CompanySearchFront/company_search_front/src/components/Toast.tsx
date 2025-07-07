import { useEffect } from 'react';

interface ToastProps {
    type: 'success' | 'error' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: () => void;
}

export function Toast({ type, title, message, duration = 5000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'info':
                return 'ℹ';
            default:
                return '';
        }
    };

    return (
        <div
            className={`toast toast--${type}`}
            style={{
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                backgroundColor: type === 'success' ? '#f0fdf4' : type === 'error' ? '#fef2f2' : '#eff6ff',
                border: `1px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'}`,
                borderRadius: '8px',
                padding: '1rem 1.5rem',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                zIndex: 9999,
                minWidth: '300px',
                maxWidth: '500px',
                animation: 'toastSlideIn 0.3s ease-out'
            }}
        >
            <div className="toast__content" style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                <span className="toast__icon" style={{ fontSize: '1.25rem', flexShrink: 0 }}>
                    {getIcon()}
                </span>
                <div className="toast__message" style={{ flex: 1 }}>
                    <div className="toast__title" style={{
                        fontWeight: 600,
                        margin: '0 0 0.25rem 0',
                        color: '#1f2937'
                    }}>
                        {title}
                    </div>
                    {message && (
                        <div className="toast__text" style={{
                            margin: 0,
                            color: '#6b7280',
                            fontSize: '0.875rem'
                        }}>
                            {message}
                        </div>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="toast__close"
                    aria-label="Cerrar notificación"
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: 0,
                        lineHeight: 1
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
}