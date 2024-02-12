import { useStatesStore } from '~~/store/states';

export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) {
        return;
    }

    const publicPages = ['/auth', '/about', '/signup', '/signup-activation', '/forgot-password', '/reset-password'];
    if (publicPages.includes(to.path)) {
        return;
    }

    const statesStore = useStatesStore();
    const { isLogged } = useBeditaAuth();
    if (!isLogged.value) {
        statesStore.menu = [];
        return navigateTo('/auth', { redirectCode: 301 });
    }
});
