export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    return await $fetch(
      apiUrl('/config'), {
        method: 'POST',
        headers: { ...authorizationHeaders(), ...{ 'Content-Type': 'application/json' } },
        body,
      }
    );
  } catch (err: any) {
    return handleApiError(event, err);
  }
});
