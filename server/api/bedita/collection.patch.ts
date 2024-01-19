export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = await beditaClient(event);
        const response = await client.patch(`/collections/${body.id}`, {
            data: {
                id: `${body.id}`,
                type: 'collections',
                attributes: body.attributes,
            }
        });

        return response.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
