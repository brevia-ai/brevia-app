export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let url = '/collections';
  if (query.uuid) {
    url += `/${query.uuid}`;
    delete query.uuid;
  }
  try {
    const response: any = await apiFetch(url, { query }, event);

    if ('name' in query && response.length > 0) {
      return response[0];
    }

    return response;
  } catch (error) {
    return handleApiError(event, error);
  }
});
