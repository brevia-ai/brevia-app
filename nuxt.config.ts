// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: '123', // unused
        public: {
            apiUrl: process.env.API_BASE_URL || '',
            streaming: process.env.STREAMING || 'true', // streaming support
            aclMenu: [
                {
                    code: 'doorway',
                    menu: [
                        {link : '/chatbot/doorway-new', title: 'Doorway New'},
                        {link : '/chatbot/doorway-nltk-1000', title: 'Doorway 1000'},
                        {link : '/chatbot/doorway-nltk-2000', title: 'Doorway 2000'},
                        {link : '/chatbot/doorway-wiseair-1000', title: 'Wiseair deal 1000'},
                        {link : '/chatbot/doorway-wiseair-2000', title: 'Wiseair deal 2000'},
                    ],
                },
                {
                    code: 'enpacl',
                    menu: [
                        {link : '/chatbot/enpacl', title: 'Enpacl FAQ'},
                        {link : '/summary', title: ''},
                        {link : '/chatbot/doorway-new', title: 'Doorway New'},
                        {link : '/chatbot/biologia', title: 'Biologia'},
                    ],
                    options: {
                        chatbotDocs: true,
                    },
                },
                {
                    code: 'iseo',
                    menu: [
                        {link : '/chatbot/iseo', title: 'ISEO Tech documents'},
                        {link : '/summary', title: ''},
                    ],
                },
                {
                    code: 'chatlas',
                    menu: [
                        {link : '/summary', title: ''},
                        {link : '/chatbot/doorway-new', title: 'Doorway New'},
                        {link : '/chatbot/storia-novecento', title: 'Storia 900'},
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
