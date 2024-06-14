export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const url = useRuntimeConfig().apiBaseUrl + `/collections/${id}`;
        await fetch(url, {method: 'DELETE'});
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
