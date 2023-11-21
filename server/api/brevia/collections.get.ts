const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const url = config.apiBaseUrl + `/collections`
    const query = getQuery(event);

    try {
        const response: any = await $fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + config.apiSecret,
            },
            query,
        });

        if ('name' in query && response.length > 0) {
            return response[0];
        }

        return response;
    } catch (err: any) {
        console.log(err);
        return {error: err?.message || 'Unknown error'};
    }
});
