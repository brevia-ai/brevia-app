// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: '123', // unused
        public: {
            apiUrl: process.env.API_BASE_URL || '',
        },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        // '@nuxtjs/axios',
    ],
    css: ['@/assets/style.css'],
})
