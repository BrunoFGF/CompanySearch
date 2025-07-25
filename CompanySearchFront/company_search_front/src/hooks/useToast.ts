import { useState, useCallback } from 'react';

interface ToastData {
    id: string;
    type: 'success' | 'error' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string) => {
        addToast({ type: 'success', title, message });
    }, [addToast]);

    const error = useCallback((title: string, message?: string) => {
        addToast({ type: 'error', title, message });
    }, [addToast]);

    const info = useCallback((title: string, message?: string) => {
        console.log('Toast info:', title, message); // Debug
        addToast({ type: 'info', title, message });
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
    };
}