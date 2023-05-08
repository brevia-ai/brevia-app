const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const url = config.apiBaseUrl + '/prompt'
    const body = await readBody(event);
    const sessionId = getRequestHeader(event, 'X-Chat-Session') || '';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + config.apiSecret,
            'X-Chat-Session': sessionId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    return await response.json();
});
