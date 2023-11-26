// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        allowedBeditaEndpoints: [],
        apiSecret: '',
        apiBaseUrl: '',
        beditaApiBaseUrl: '',
        beditaApiKey: '',
        recaptchaSecret: '',
        session: {
            secret: '',
            name: 'Brevia',
        },
        public: {
            appName: 'BREVIA',
            appDescription: '',
            features: {
                signupAvailable: '',
            },
            maxUserChatbots: '',
            recaptchaKey: '',
            // demo limits
            demo: {
                maxChatMessages: '30', // max chatbot msg number per day
                maxChatFiles: '3', // max number of files per Chatbot
                maxChatQA: '20', // max number of Q&A per Chatbot
                maxFileSize: '5', // max file size in MB
                maxAnalysis: '5', // max num analysis per day
            },
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
