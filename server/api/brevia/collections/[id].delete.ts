export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        await $fetch(apiUrl(`/collections/${id}`), {
            method: 'DELETE',
            headers: authorizationHeaders(),
        });
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
