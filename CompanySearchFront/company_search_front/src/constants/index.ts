export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    MAX_PAGE_SIZE: 100,
} as const;

export const SEARCH = {
    MIN_SEARCH_LENGTH: 2,
    DEBOUNCE_DELAY: 300,
    MAX_SEARCH_LENGTH: 100,
} as const;

export const MESSAGES = {
    LOADING: 'Cargando...',
    SEARCHING: 'Buscando compañías...',
    NO_RESULTS: 'No se encontraron resultados',
    ERROR_GENERIC: 'Ha ocurrido un error inesperado',
    ERROR_NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
    ERROR_SERVER: 'Error del servidor. Intenta nuevamente.',
    SEARCH_PLACEHOLDER: 'Buscar por nombre, dirección o país...',
} as const;

export const APP_CONFIG = {
    NAME: 'Company Search',
    VERSION: '1.0.0',
    AUTHOR: 'Company Search Team',
} as const;

export const SEARCH_TYPES = {
    ALL: 'all',
    NAMES: 'names',
} as const;

export const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
} as const;