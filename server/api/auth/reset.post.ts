export default defineEventHandler(async (event) => {
    try {
        const resetUrl = (`${getRequestURL(event).origin}/reset-password`);
        const reqBody = await readBody(event);
        const body = {
            contact: reqBody?.contact,
            change_url: resetUrl,
        }
        const client = beditaApiClient();
        const response = await client.post('/auth/change', body);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
