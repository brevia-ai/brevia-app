// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_PROMPT_URL || '',
        },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        // '@nuxtjs/axios',
    ],
    css: ['@/assets/style.css'],
})
