import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    if (!body.document_id) {
        body.document_id = uuidv4();
    }

    try {
        await fetch(apiUrl('/index/link'), {
            method: 'POST',
            headers: apiHeaders(true),
            body: JSON.stringify(body),
        });

    } catch (err) {
        console.log(err);
        return JSON.stringify({error: err?.message || 'Unknown error'});
    }

});
