// Utilidades para formateo de números
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-ES').format(num);
};

// Utilidad para debounce (futuro uso en búsquedas)
export const debounce = <T extends (...args: never[]) => never>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: number;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Utilidad para capitalizar texto
export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Utilidad para truncar texto
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

// Utilidad para validar email (futuro uso)
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Utilidad para generar IDs únicos
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};