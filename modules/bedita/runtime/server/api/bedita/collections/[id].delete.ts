export default defineEventHandler(async (event) => {
    try {
        const path = event.path;
        const id = path.substring(path.lastIndexOf('/') + 1);
        const client = await beditaApiClient(event);
        const response = await client.get(`/collections?filter[collection_uuid]=${id}`);
        const collectionId = response.data.data?.[0]?.id;
        if (!collectionId) {
            return handleBeditaApiError(event, Error('Collection not found'));
        }

        await client.delete(`/collections/${collectionId}`);
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
