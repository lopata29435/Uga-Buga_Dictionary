// Конфигурация API для frontend приложения
const config = {
  // Базовый URL API - для продакшена на вашем сервере
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://lopata.su',

  // Версия API (соответствует docker-compose.yml: API_VERSION=v1.1.1)
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1.1.1',

  // Полный URL API
  get API_URL() {
    return `${this.API_BASE_URL}/api/${this.API_VERSION}`;
  },

  // Эндпоинты
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh'
    },
    dictionary: {
      words: '/dictionary/words',
      search: '/dictionary/words/search',
      wordById: (id) => `/dictionary/words/${id}`,
      wordByText: (word) => `/dictionary/words/text/${word}`
    }
  },

  // Настройки приложения
  app: {
    name: 'Уга-Бунга Словарь',
    version: '1.0.0',
    profileImageUrl: 'https://images.unsplash.com/photo-1573495627361-d9b87960b12d?w=200&h=200&fit=crop&crop=face'
  }
};

export default config;
