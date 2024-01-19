export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const client = await beditaClient(event);
        const response = await client.delete(`/questions/${id}`);

        return response.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
