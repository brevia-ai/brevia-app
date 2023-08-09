const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const uuid = event.context.params?.uuid;
    if (!uuid) {
        return {error: 'Missing job uuid'}
    }
    const url = config.apiBaseUrl + `/jobs/${uuid}`

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
