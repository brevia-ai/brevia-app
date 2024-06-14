export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = await beditaApiClient(event);
        const responseLinks = await client.post('/links', {
            data: {
                type: 'links',
                attributes: body.attributes,
            }
        });

        const id = responseLinks.data?.data?.id;

        await client.post(`/collections/${body.collectionId}/relationships/has_documents`, {
            data: [
                {
                    type: 'links',
                    id,
                }
            ],
        });

        return responseLinks.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
