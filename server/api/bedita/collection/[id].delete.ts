export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const client = await beditaClient(event);
        const response = await client.delete(`/collections/${id}`);

        return response.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
