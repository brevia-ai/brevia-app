export default defineEventHandler(async (event) => {
    const uuid = event.context.params?.collection_id;
    const collectionId = await beditaCollectionId(uuid, event);
    if (!collectionId) {
        return handleBeditaApiError(event, Error('Collection not found'));
    }
    let query = getQuery(event);
    const type = query?.['filter[type]'];
    if (!type) {
        return handleBeditaApiError(event, Error('Type filter is required'));
    }
    delete query['filter[type]'];
    query['filter[document_of]'] = collectionId;
    const queryString = new URLSearchParams(query).toString();
    const client = await beditaApiClient(event);

    try {
        const response = await client.get(`/${type}?${queryString}`);

        const data = response.data.data || [];
        const breviaData = data.map(breviaDocumentMetadata);

        return {
            data: breviaData,
            meta: response.data.meta || {},
        };
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
