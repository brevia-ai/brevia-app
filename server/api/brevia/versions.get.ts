export default defineEventHandler(async (event) => {
  try {
    const response: Response = await fetch(apiUrl(event, '/status'), {
      method: 'HEAD',
      headers: authorizationHeaders(event),
    });

    return {
      brevia: response.headers.get('X-Brevia-Version'),
      apiName: response.headers.get('X-API-Name'),
      apiVersion: response.headers.get('X-API-Version'),
      baseUrl: useRuntimeConfig(event).apiBaseUrl,
    };
  } catch (error) {
    return handleApiError(event, error);
  }
});
