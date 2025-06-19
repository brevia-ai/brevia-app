import pkg from './package.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    apiBaseUrl: '',
    // multi-project configuration
    projects: {},
    public: {
      projectLogin: false, // disable/enable project-login page
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
      brevia: {
        features: {
          signup: false,
          changePassword: false,
          deleteAccount: false,
          privacyDocuments: false,
          demoVersion: false,
        },
      },
      version: pkg?.version,
      minBreviaVersion: '0.8.0',
    },
    // brevia integration session & auth credentials
    brevia: {
      session: {
        name: 'Brevia',
        secret: 'change-this-super-secret-secret-secret-password',
      },
      authCredentials: [{ username: 'brevia', password: 'brevia' }],
    },
  },

  imports: {
    dirs: ['store', 'server/utils'],
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-icon',
    'nuxt-gtag',
    '@nuxt/eslint',
  ],
  extends: [['github:brevia-ai/nuxt-chatbot-layer#v0.3.1', { install: true }]],
  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      ],
    },
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

  compatibilityDate: '2024-10-02',
});
