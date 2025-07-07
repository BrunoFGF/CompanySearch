import React from 'react';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';
import { ToastContext } from '../hooks/useToastContext';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { toasts, removeToast, success, error, info } = useToast();

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}

            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
}