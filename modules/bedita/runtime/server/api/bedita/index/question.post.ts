export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const attributes = {
        title: body.title,
        body: body.answer,
        extra: {
            brevia: {
                metadata: body.metadata,
                options: body.options,
            },
        },
    };

    if (!body.document_id) {
        return createCollectionDocument('questions', body.collection_id, attributes, event);
    }

    try {
        const client = await beditaApiClient(event);

        const response = await client.patch(`/questions/${body.document_id}`, {
            data: {
                type: 'questions',
                id: body.document_id,
                attributes,
            }
        });

        return response.formattedData;

    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
