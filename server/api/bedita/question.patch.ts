export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = await beditaClient(event);
        const responseQuestions = await client.patch(`/questions/${body.id}`, {
            data: {
                type: 'questions',
                id: body.id,
                attributes: body.attributes,
            }
        });

        return responseQuestions.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
