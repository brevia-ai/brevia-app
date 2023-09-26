export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = beditaApiClient();
        const resp = await client.post('/signup/activation', body);

        return resp.data;
    } catch(error) {
        return handleBeditaApiError(event, error);
    }
})
