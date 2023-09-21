import { useStatesStore } from '~~/store/states';

export default defineNuxtRouteMiddleware(async (to) => {
    if (!process.client) return;

    const publicPages = ['/auth', '/about', '/signup', '/signup-activation'];
    if (publicPages.includes(to.path)) {
        return;
    }

    const nuxtApp = useNuxtApp();
    const store = useStatesStore();
    const menu = store.getMenu();
    if (!menu.length) {
        return navigateTo('/auth', { redirectCode: 301 });
    } else {
        store.setIsLogged();
    }
});
