import { useStatesStore } from '~~/store/states';
import { useSession } from 'h3';
import { breviaSessionConfig } from '~~/server/utils/session';
import { buildUserMenu } from '~~/utils/user-data-store';
import { menuItems } from '~~/server/utils/menu-items';

export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) {
        const event = useRequestEvent();
        const session = await useSession(event, breviaSessionConfig());
        console.log('session data', session.data);
        if (session.data?.user && session.data?.user?.username !== undefined) {
            const statesStore = useStatesStore();
            statesStore.userLogin(session.data.user);
            console.log('User logged in', session.data.user);
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
        publicPages.push('/signup');
    }
    if (features.changePassword) {
        publicPages.push('/forgot-password', '/reset-password');
    }
    if (features.privacyDocuments) {
        publicPages.push('/privacy/privacy-policy', '/privacy/terms-conditions', '/privacy/cookie-policy');
    }
    if (publicPages.includes(to.path)) {
        console.log('Public page', to.path);
        return;
    }

    if (!useIntegrationAuth().isLogged.value) {
        console.log('User not logged');
        useStatesStore().$reset();
        return navigateTo('/auth', { redirectCode: 301 });
    }
    console.log('User is logged');
});
