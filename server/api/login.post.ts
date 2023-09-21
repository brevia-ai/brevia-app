export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = beditaApiClient();
        await client.authenticate(body?.username, body?.password);
        const response = await client.getUserAuth(['has_access']);

        return response?.data || {};
    } catch (err) {
        console.log(err);
        return {error: err?.message || 'Unknown error'};
    }
});
