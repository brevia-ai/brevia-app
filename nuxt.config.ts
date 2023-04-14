// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: '123', // unused
        public: {
            apiUrl: process.env.API_BASE_URL || '',
            aclMenu: [
                {
                    password: 'doorway',
                    menu: [
                        {link : '/chatbot/doorway', title: "Doorway"},
                        {link : '/chatbot/wiseair-doorway', title: "Wiseair deal"},
                    ],
                },
                {
                    password: 'chatlas',
                    menu: [
                        {link : '/summary', title: ""},
                        {link : '/chatbot/storia-novecento', title: "Storia 900"},
                        {link : '/chatbot/wiseair-doorway', title: "Wiseair deal"},
                        {link : '/chatbot/biologia', title: "Biologia"},
                    ],
                },
            ],
        },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        // '@nuxtjs/axios',
    ],
    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
        }
    },
    css: ['@/assets/style.css'],
})
