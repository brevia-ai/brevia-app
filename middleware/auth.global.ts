import { useStatesStore } from '~~/store/states';
import { useSession } from 'h3';
import { getSessionConfig } from '~~/server/utils/session';

export default defineNuxtRouteMiddleware(async (to) => {
    const statesStore = useStatesStore();
    if (process.server) {
        const event = useRequestEvent();
        const session = await useSession(event, getSessionConfig());
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
