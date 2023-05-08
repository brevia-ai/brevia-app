const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const url = config.apiBaseUrl + '/collections'

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + config.apiSecret,
        },
    });

    return await response.json();
});
