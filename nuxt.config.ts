// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        allowedBeditaEndpoints: [],
        apiSecret: process.env.API_SECRET || '',
        apiBaseUrl: process.env.API_BASE_URL || '',
        beditaApiBaseUrl: process.env.BEDITA_API_BASE_URL || '',
        beditaApiKey: process.env.BEDITA_API_KEY || '',
        session: {
            secret: process.env.SESSION_SECRET,
            name: process.env.SESSION_NAME || 'Brevia',
        },
        public: {
            maxUserChatbots: process.env.MAX_USER_CHATBOTS || '',
            signupAvailable: process.env.FEATURE_SIGNUP_AVAILABLE === 'true',
        },
    },

    imports: {
        dirs: ['store'],
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/i18n',
        'nuxt-icon',
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
