export default defineEventHandler(async (event) => {
    try {
        const { logout } = useBeditaAuth();

        await logout();

    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
