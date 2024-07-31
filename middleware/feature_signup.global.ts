export default defineNuxtRouteMiddleware(async (to) => {
  const signupPages = ['/signup', '/signup-activation'];
  const isSignupAvailable = useIntegrationFeatures()?.signup || false;
  if (signupPages.includes(to.path) && !isSignupAvailable) {
    return navigateTo('/', { redirectCode: 404 });
  }
});
