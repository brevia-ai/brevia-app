export default defineNuxtRouteMiddleware(async (to) => {
    const signupPages = ['/signup', '/signup-activation'];
    const config = useRuntimeConfig();
    const isSignupAvailable = config.public.signupAvailable;
    if (signupPages.includes(to.path) && !isSignupAvailable ) {
        return navigateTo('/', { redirectCode: 404 })
    }
  })
