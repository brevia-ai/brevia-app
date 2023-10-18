import { useStatesStore } from '~~/store/states';
import { useSession } from 'h3';

export default defineNuxtRouteMiddleware(async (to) => {
    const statesStore = useStatesStore();
    if (process.server) {
        const config = useRuntimeConfig();
        const event = useRequestEvent();
        const session = await useSession(event, config.session );
        const userData = session.data?.['bedita.user'];
        if (userData) {
            statesStore.userLogin(userData);
        }

        return;
    }

    const publicPages = ['/auth', '/about', '/signup', '/signup-activation', '/forgot-password', '/reset-password'];
    if (publicPages.includes(to.path)) {
        return;
    }

    if (!statesStore.isLogged) {
        statesStore.setMenu(null);
        return navigateTo('/auth', { redirectCode: 301 });
    }
});
