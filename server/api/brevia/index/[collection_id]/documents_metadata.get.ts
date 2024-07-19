const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const collection_id = event.context.params?.collection_id;
  const query = getQuery(event);
  const url = config.apiBaseUrl + `/index/${collection_id}/documents_metadata`;
  try {
    const response: any = await $fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + config.apiSecret,
      },
      query,
    });
    return response;
  } catch (err: any) {
    console.log(err);
    return JSON.stringify({ error: err?.message || 'Unknown error' });
  }
});
