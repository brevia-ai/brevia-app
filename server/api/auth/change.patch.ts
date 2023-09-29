export default defineEventHandler(async (event) => {
    try {
        const reqBody = await readBody(event);
        const client = beditaApiClient();
        const response = await client.patch('/auth/change', reqBody);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});