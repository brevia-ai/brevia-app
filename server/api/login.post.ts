import { FormatUserInterceptor } from '@atlasconsulting/bedita-sdk';
import { filterUserDataToStore } from '~~/utils/user-data-store';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const client = await beditaApiClient(event);
        await client.authenticate(body?.username, body?.password);
        const response = await client.get('/auth/user', {
            params: {
                include: 'has_access',
            },
            responseInterceptors: [new FormatUserInterceptor(client)],
        });

        await client.getStorageService().set('user', filterUserDataToStore(response?.formattedData));

        return response?.formattedData || {};
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
