// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: process.env.API_SECRET || '',
        apiBaseUrl: process.env.API_BASE_URL || '',
        public: {
            apiUrl: process.env.API_BASE_URL || '',
            aclMenu: [
                {
                    code: 'doorway',
                    menu: [
                        {link : '/chatbot/doorway-nltk-1000', title: 'Doorway 1000'},
                        {link : '/chatbot/doorway-nltk-2000', title: 'Doorway 2000'},
                        {link : '/chatbot/doorway-wiseair-1000', title: 'Wiseair deal 1000'},
                        {link : '/chatbot/doorway-wiseair-2000', title: 'Wiseair deal 2000'},
                    ],
                },
                {
                    code: 'chatlas',
                    menu: [
                        {link : '/summary', title: ''},
                        {link : '/chatbot/storia-novecento', title: 'Storia 900'},
                        {link : '/chatbot/doorway-nltk-1000', title: 'Doorway 1000'},
                        {link : '/chatbot/doorway-nltk-2000', title: 'Doorway 2000'},
                        {link : '/chatbot/doorway-wiseair-1000', title: 'Wiseair deal 1000'},
                        {link : '/chatbot/doorway-wiseair-2000', title: 'Wiseair deal 2000'},
                        {link : '/chatbot/biologia', title: 'Biologia'},
                    ],
                    options: {
                        chatbotDocs: true,
                    },
                },
            ],
        },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        // '@nuxtjs/axios',
    ],
    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
        }
    },
    css: ['@/assets/style.css'],
})
