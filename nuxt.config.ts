// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        allowedBeditaEndpoints: [],
        apiSecret: '',
        apiBaseUrl: '',
        beditaApiBaseUrl: '',
        beditaApiKey: '',
        session: {
            secret: '',
            name: '' || 'Brevia',
        },
        public: {
            features: {
                signupAvailable: '',
            },
            maxUserChatbots: '',
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
