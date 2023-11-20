export default defineEventHandler(async (event) => {
    try {
        const client = await beditaApiClient(event);
        const response = await client.get('/auth/user', {
            params: {
                include: 'has_access',
            },
        });

        return response?.formattedData?.data?.relationships?.has_access?.data || [];
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
