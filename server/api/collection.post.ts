export default defineEventHandler(async (event) => {
    try {
        const attributes = await readBody(event);
        const client = await beditaApiClient(event);
        const responseCollection = await client.post('/collections', {
            data: {
                type: 'collections',
                attributes,
            }
        });

        const id = responseCollection.data?.data?.id;
        const user = await client.getStorageService().get('user');

        await client.post(`/collections/${id}/relationships/accessed_by`, {
            data: [
                {
                    type: 'users',
                    id: user.id,
                }
            ],
        });

        return responseCollection.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
