import { useStatesStore } from '~~/store/states';
import { useSession } from 'h3';
import { breviaSessionConfig, beditaSessionConfig } from '~~/server/utils/session';
import { buildUserMenu } from '~~/utils/user-data-store';
import { menuItems } from '~~/server/utils/menu-items';

const sessionConfig = () => {
    const integration = useIntegration();
    return integration == 'brevia' ? breviaSessionConfig() : beditaSessionConfig();
}

const userSession = (session) => {
    const integration = useIntegration();
    if (integration === 'brevia') {
        return session.data?.user;
    } else if (integration === 'bedita') {
        return session.data?.['bedita.user'];
    }

    return null;
}


export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) {
        const event = useRequestEvent();
        const session = await useSession(event, sessionConfig());
        const user = userSession(session);
        if (user) {
            const statesStore = useStatesStore();
            statesStore.userLogin(user);
            if (to.path !== '/index' && to.path !== '/') { // In index page menu is loaded client side
                try {
                    const items = await menuItems();
                    statesStore.menu = buildUserMenu(items);
                } catch (error) {
                    console.error('Error loading menu', error);
                }
            }
        }

        return;
    }

    let publicPages = ['/auth', '/about'];
    const features = useIntegrationFeatures();
    if (features.signup) {
        publicPages.push('/signup', '/signup-activation');
    }
    if (features.changePassword) {
        publicPages.push('/forgot-password', '/reset-password');
    }
    if (features.privacyDocuments) {
        publicPages.push('/privacy/privacy-policy', '/privacy/terms-conditions', '/privacy/cookie-policy');
    }
    if (publicPages.includes(to.path)) {
        return;
    }

    const statesStore = useStatesStore();
    if (!statesStore.isLogged()) {
        useStatesStore().$reset();
        return navigateTo('/auth', { redirectCode: 301 });
    }
});
