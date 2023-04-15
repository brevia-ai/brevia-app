import { useStatesStore } from '~~/store/states';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!process.client) return;

    if (['/auth', '/about'].includes(to.path)) {
        return;
    }

    const nuxtApp = useNuxtApp();
    const menu = JSON.parse(localStorage.getItem('menu') || '[]');
    if (!menu.length) {
        return navigateTo('/auth', { redirectCode: 301 });
    } else {
        const store = useStatesStore();
        store.setIsLogged();
    }
});
