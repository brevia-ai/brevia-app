export default defineEventHandler(async (event) => {
    const collection_id = event.context.params?.collection_id;
    const document_id = event.context.params?.document_id;
    try {
        return await $fetch(apiUrl(`/index/${collection_id}/${document_id}`), {
            method: 'DELETE',
            headers: authorizationHeaders(),
        });
    } catch (err) {
        return handleApiError(event, err);
    }
});
