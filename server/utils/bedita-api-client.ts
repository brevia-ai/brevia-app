import { ApiProvider, BEditaApiClient, MapIncludedInterceptor, MemoryStorageAdapter, ApiResponseBodyError } from '@atlasconsulting/bedita-sdk';
import { AxiosError, isAxiosError } from 'axios';
import type { H3Event } from 'h3';

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

export const handleBeditaApiError = async (event: H3Event, error: AxiosError | any): Promise<ApiResponseBodyError> => {
    if (isAxiosError(error) && error?.response) {
        setResponseStatus(event, error.response.status);

        return error.response.data;
    }

    setResponseStatus(event, 500);

    return { 'error': error?.message || 'Some error occured :(' };
};
