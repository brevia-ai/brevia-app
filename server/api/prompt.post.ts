const config = useRuntimeConfig()

function readChunks(reader) {
    return {
        async* [Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                yield readResult.value;
                readResult = await reader.read();
            }
        },
    };
}

export default defineEventHandler(async (event) => {
    const url = config.apiBaseUrl + '/prompt'
    const body = await readBody(event);
    const sessionId = getRequestHeader(event, 'X-Chat-Session') || '';

    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + config.apiSecret,
                'X-Chat-Session': sessionId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),

        }).then(async (response) => {
            // response.body is a ReadableStream
            const reader = response?.body?.getReader();
            for await (const chunk of readChunks(reader)) {
                let writeNext = event.node.res.write(chunk);
                if (writeNext) {
                    continue;
                }
                event.node.res.once('drain', () => writeNext = true);
                do {
                    console.log('wating...');
                } while (!writeNext);
            }

            event.node.res.end();
        });

    } catch (err) {
        console.log(err);
        return JSON.stringify({error: err?.message || 'Unknown error'});
    }

});
