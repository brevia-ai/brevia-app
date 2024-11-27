export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let url = '/collections';
  if (query.uuid) {
    url += `/${query.uuid}`;
    delete query.uuid;
  }
  try {
    const response: any = await $fetch(apiUrl(url), {
      headers: authorizationHeaders(),
      query,
    });

    if ('name' in query && response.length > 0) {
      return response[0];
    }

    return response;
  } catch (err: any) {
    console.log(err);
    return { error: err?.message || 'Unknown error' };
  }
});
