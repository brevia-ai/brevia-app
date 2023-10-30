export default defineNuxtRouteMiddleware(async (to) => {
    const signupPages = ['/signup', '/signup-activation'];
    const isSignupAvailable = process.env.SIGNUP_AVAILABLE === 'true';
    if (signupPages.includes(to.path) && !isSignupAvailable ) {
        return navigateTo('/', { redirectCode: 404 })
    }
  })
