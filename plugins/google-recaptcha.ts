import { VueReCaptcha } from 'vue-recaptcha-v3';

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();

    nuxtApp.vueApp.use(VueReCaptcha, {
        siteKey: runtimeConfig.public.recaptchaKey,
        loaderOptions: {
            useRecaptchaNet: true,
            autoHideBadge: true,
        },
    });
});
