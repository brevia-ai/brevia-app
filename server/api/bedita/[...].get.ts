const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const path = event.path.replace(/^\/api\/bedita/, '') || '';

    if (config.allowedBeditaEndpoints.length && !config.allowedBeditaEndpoints.filter(endpoint => path.startsWith(endpoint)).length) {
        throw createError({
            statusCode: 404,
        });
    }

    try {
        const client = await beditaApiClient(event);
        const response = await client.get(path, { params: getQuery(event) });

        return { ...response.data, formattedData: response?.formattedData || {} };
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
