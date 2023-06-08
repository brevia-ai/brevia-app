const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const url = config.apiBaseUrl + '/prompt'
    const body = await readBody(event);
    const sessionId = getRequestHeader(event, 'X-Chat-Session') || '';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + config.apiSecret,
                'X-Chat-Session': sessionId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
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
