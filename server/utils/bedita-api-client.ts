import { ApiProvider, BEditaApiClient, MapIncludedInterceptor, MemoryStorageAdapter } from '@atlasconsulting/bedita-sdk';
export const beditaApiClient = (): BEditaApiClient => {
    if (ApiProvider.has('bedita')) {
        return ApiProvider.get('bedita');
    }

    const config = useRuntimeConfig();
    const client = ApiProvider.get('bedita', {
        baseUrl: config.beditaApiBaseUrl,
        apiKey: config.beditaApiKey,
        storageAdapter: new MemoryStorageAdapter(),
    });
    client.addInterceptor(new MapIncludedInterceptor());

    return client;
};