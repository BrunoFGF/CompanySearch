export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    ENDPOINTS: {
        companies: '/api/companies',
        search: '/api/companies/search',
        searchNames: '/api/companies/search/names',
    }
} as const;

export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
} as const;