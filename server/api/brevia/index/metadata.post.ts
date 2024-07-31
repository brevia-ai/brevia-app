const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const url = config.apiBaseUrl + '/index/metadata';
  const body = await readBody(event);

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + config.apiSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.log(err);
    return JSON.stringify({ error: err?.message || 'Unknown error' });
  }
});
