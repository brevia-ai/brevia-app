export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const title = body.cmetadata?.title || Math.random().toString(36).substring(2, 12);
    body.name = title.toLowerCase().replaceAll(' ', '-') || '';
    return await $fetch(apiUrl('/collections'), {
      method: 'POST',
      headers: authorizationHeaders(),
      body,
    });
  } catch (err: any) {
    console.log(err);
    return { error: err?.message || 'Unknown error' };
  }
});
