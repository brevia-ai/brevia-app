import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: '',
        apiBaseUrl: '',
        public: {
            appName: 'BREVIA',
            appDescription: '',
            appLogo: '/brevia-logo.svg',
            maxUserChatbots: '',
            cookiesPrivacyTerms: '',
            // demo limits
            demo: {
                maxChatMessages: '30', // max chatbot msg number per day
                maxChatFiles: '3', // max number of files per Chatbot
                maxChatQuestions: '20', // max number of Q&A per Chatbot
                maxChatLinks: '5', // max number of links per Chatbot
                maxFileSize: '5', // max file size in MB
                maxNumAnalysis: '5', // max num analysis per day
            },
            integration: 'brevia', // possibile values: brevia, bedita
            brevia : {
                features: {
                    signup: false,
                    changePassword: false,
                    deleteAccount: false,
                    privacyDocuments: false,
                    demoVersion: false,
                },
            },
            version: pkg?.version,
        },
        // brevia integration session & auth credentials
        brevia : {
            session: {
                name: 'Brevia',
                secret: 'change-this-super-secret-secret-secret-password',
            },
            authCredentials: [
                { username: 'brevia', password: 'brevia' },
            ],
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
        'nuxt-gtag',
        '@atlasconsulting/nuxt-bedita',
    ],
    build: {
        transpile: ['@vuepic/vue-datepicker']
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
    gtag: {
        id: 'G-XXXXXXXXXX',
        initialConsent: false,
    },
    bedita: {
        recaptcha: {
            enabled: true,
            hideBadge: true,
            useRecaptchaNet: true,
        },
        session: {
            name: 'Brevia',
            secret: '',
        },
    },
})
