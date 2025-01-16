import { FormatUserInterceptor } from '@atlasconsulting/bedita-sdk';
import type { UserAuth } from '@atlasconsulting/nuxt-bedita';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const client = await beditaApiClient(event);
    await client.patch('/auth/user', body);

    // update session data
    const response = await client.get('/auth/user', {
      responseInterceptors: [new FormatUserInterceptor(client)],
    });
    await client.getStorageService().set('user', filterUserDataToStore(response?.formattedData, event));

    return response.formattedData as UserAuth;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
