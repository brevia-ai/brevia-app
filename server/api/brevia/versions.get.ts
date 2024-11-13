export default defineEventHandler(async (event) => {
  try {
    const response: Response = await fetch(apiUrl('/status'), {
      method: 'HEAD',
      headers: authorizationHeaders(),
    });

    return {
      'brevia': response.headers.get('X-Brevia-Version'),
      'apiName': response.headers.get('X-API-Name'),
      'apiVersion': response.headers.get('X-API-Version'),
    }
  } catch (error) {
    return handleApiError(event, error);
  }
});
