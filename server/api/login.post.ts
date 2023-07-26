import { ApiProvider, MapIncludedInterceptor, MemoryStorageAdapter } from '@atlasconsulting/bedita-sdk';

const config = useRuntimeConfig();
const client = ApiProvider.get('bedita', {
    baseUrl: config.beditaApiBaseUrl,
    apiKey: config.beditaApiKey,
    storageAdapter: new MemoryStorageAdapter(),
});
client.addInterceptor(new MapIncludedInterceptor());


export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        await client.authenticate(body?.username, body?.password);
        const response = await client.getUserAuth(['has_access']);

        return response?.data || {};
    } catch (err) {
        console.log(err);
        return {error: err?.message || 'Unknown error'};
    }
});
