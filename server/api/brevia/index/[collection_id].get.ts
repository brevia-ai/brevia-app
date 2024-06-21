export default defineEventHandler(async (event) => {
    const collection_id = event.context.params?.collection_id;
    const query = getQuery(event);
    try {
        return await $fetch(apiUrl(`/index/${collection_id}`), {
            method: 'GET',
            headers: authorizationHeaders(),
            query,
        });

    } catch (err) {
        return handleApiError(event, err);
    }
});
