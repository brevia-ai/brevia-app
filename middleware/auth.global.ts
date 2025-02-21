import { useStatesStore } from '~~/store/states';
import { useSession, type SessionData } from 'h3';
import { sessionConfig } from '~~/server/utils/session';
import { buildUserMenu } from '~~/utils/user-data-store';
import { menuItems } from '~~/server/utils/menu-items';

const userSession = (sessionData: SessionData) => {
  const integration = useIntegration();
  if (integration === 'brevia') {
    return sessionData?.user;
  } else if (integration === 'bedita') {
    return sessionData?.['bedita.user'];
  }

  return null;
};

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/' || to.path === '/index') {
    const statesStore = useStatesStore();
    statesStore.clearCollection();
  }

  if (import.meta.server) {
    const event = useRequestEvent();
    if (event) {
      const session = await useSession(event, sessionConfig(event));
      const user = userSession(session.data);
      if (user) {
        const statesStore = useStatesStore();
        statesStore.userLogin(user);
        statesStore.project = session.data?._project || null;
        if (to.path !== '/index' && to.path !== '/') {
          // In index page menu is loaded client side
          try {
            const items = await menuItems(event);
            statesStore.menu = buildUserMenu(items);
          } catch (error) {
            console.error('Error loading menu', error);
          }
        }
      }
      return;
    }
  }

  const publicPages = ['/auth', '/about'];
  const features = useIntegrationFeatures();
  if (features.signup) {
    publicPages.push('/signup', '/signup-activation');
  }
  if (features.changePassword) {
    publicPages.push('/forgot-password', '/reset-password');
  }
  if (features.privacyDocuments) {
    publicPages.push(
      '/privacy/privacy-policy',
      '/privacy/terms-conditions',
      '/privacy/cookie-policy',
    );
  }
  if (
    publicPages.includes(to.path) ||
    to.path.startsWith('/chatbot-iframe/') ||
    to.path.startsWith('/project-login/')
  ) {
    return;
  }

  const statesStore = useStatesStore();
  if (!statesStore.isLogged()) {
    useStatesStore().$reset();
    return navigateTo('/auth', { redirectCode: 301 });
  }
});
