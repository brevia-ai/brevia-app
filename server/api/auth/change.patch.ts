export default defineEventHandler(async (event) => {
    try {
        const reqBody = await readBody(event);
        const client = await beditaApiClient(event);
        const response = await client.patch('/auth/change', reqBody);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
