const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const collection_id = event.context.params?.collection_id;
  const document_id = event.context.params?.document_id;
  const url = config.apiBaseUrl + `/index/${collection_id}/${document_id}`;
  try {
    return await $fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + config.apiSecret,
      },
    });
  } catch (err: any) {
    console.log(err);
    return JSON.stringify({ error: err?.message || 'Unknown error' });
  }
});
