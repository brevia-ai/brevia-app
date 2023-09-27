// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: process.env.API_SECRET || '',
        apiBaseUrl: process.env.API_BASE_URL || '',
        beditaApiBaseUrl: process.env.BEDITA_API_BASE_URL || '',
        beditaApiKey: process.env.BEDITA_API_KEY || '',
        public: {},
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/i18n',
    ],
    build: {
        transpile: ['tslib']
    },
    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
        }
    },
    css: ['@/assets/style.css'],
    i18n: {
        strategy: 'no_prefix',
        locales: ['it', 'en'],
    },
})
