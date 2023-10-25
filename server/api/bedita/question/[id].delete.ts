export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const client = await beditaApiClient(event);
        const responseCollection = await client.delete(`/objects/${id}`);

        return responseCollection.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
