export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  try {
    const response: any = await $fetch(apiUrl('/collections'), {
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
