export default defineEventHandler(async (event) => {
  try {
    const project = await currentProject(event);
    const response: Response = await fetch(apiUrl(event,  '/status', project), {
      method: 'HEAD',
      headers: apiHeaders(event),
    });

    return {
      brevia: response.headers.get('X-Brevia-Version'),
      apiName: response.headers.get('X-API-Name'),
      apiVersion: response.headers.get('X-API-Version'),
      baseUrl: apiBaseUrl(event, project),
    };
  } catch (error) {
    return handleApiError(event, error);
  }
});
