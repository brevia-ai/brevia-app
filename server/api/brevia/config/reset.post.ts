export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    return await $fetch(apiUrl(event, '/config/reset'), {
      method: 'POST',
      headers: { ...authorizationHeaders(event), ...{ 'Content-Type': 'application/json' } },
      body,
    });
  } catch (err: any) {
    return handleApiError(event, err);
  }
});
