export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = await beditaApiClient(event);
        const responseLinks = await client.patch(`/links/${body.id}`, {
            data: {
                type: 'links',
                id: body.id,
                attributes: body.attributes,
            }
        });

        return responseLinks.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
