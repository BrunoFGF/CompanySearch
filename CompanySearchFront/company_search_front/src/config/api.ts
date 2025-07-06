// Configuración base de la API
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    ENDPOINTS: {
        companies: '/api/companies',
        search: '/api/companies/search',
        searchNames: '/api/companies/search/names',
    },
    DEFAULT_PAGE_SIZE: 10 as number,
    MAX_PAGE_SIZE: 100 as number,
} as const;

// Headers por defecto
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
} as const;