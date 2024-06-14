export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { user, optOut } = useBeditaAuth();

        await optOut(user.username, body.password);

    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
