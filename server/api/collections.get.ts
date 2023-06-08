const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const url = config.apiBaseUrl + '/collections'

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + config.apiSecret,
            },
        });

        const respBody = await response.json();
        if (!response.ok) {
            return {
                error: respBody?.detail,
                status: response.status,
            };
        }
        return respBody;

    } catch (err) {
        console.log(err);
        return {error: err?.message || 'Unknown error'};
    }
});
