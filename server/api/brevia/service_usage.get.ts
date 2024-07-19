const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  // This endpoint is available only in Playground API
  const url = config.apiBaseUrl + `/service_usage`;
  const query = getQuery(event);

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
    return { error: err?.message || 'Unknown error' };
  }
});
