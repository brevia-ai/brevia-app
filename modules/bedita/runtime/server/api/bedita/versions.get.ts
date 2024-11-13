export default defineEventHandler(async (event) => {
  try {
    const client = await beditaApiClient(event);
    const response = await client.get('/home');

    return {
      bedita: response.headers.get('X-BEdita-Version'),
      apiName: response.headers.get('X-API-Name'),
      apiVersion: response.headers.get('X-API-Version'),
    };
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
