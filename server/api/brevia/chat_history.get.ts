const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const url = config.apiBaseUrl + `/chat_history`;
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
