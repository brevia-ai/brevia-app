export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        // update only title and description for now
        const attributes = {
            title: body.cmetadata.title,
            description: body.cmetadata.description,
        }
        // BEdita ID in cmetadata
        const id = body.cmetadata.id;
        const client = await beditaApiClient(event);
        const response = await client.patch(`/collections/${id}`, {
            data: {
                id: `${id}`,
                type: 'collections',
                attributes,
            }
        });

        return response.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
