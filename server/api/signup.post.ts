import { handleBeditaApiError } from "../utils/bedita-api-client";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = await beditaApiClient(event);
        const resp = await client.post('/signup', body);

        return resp.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
})
