export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = await beditaClient(event);
        const responseQuestions = await client.post('/questions', {
            data: {
                type: 'questions',
                attributes: body.attributes,
            }
        });

        const id = responseQuestions.data?.data?.id;

        await client.post(`/collections/${body.collectionId}/relationships/has_documents`, {
            data: [
                {
                    type: 'questions',
                    id,
                }
            ],
        });

        return responseQuestions.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
