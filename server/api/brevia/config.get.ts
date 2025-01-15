export default defineEventHandler(async (event) => {
  try {
    return await $fetch(apiUrl(event, '/config'), { headers: authorizationHeaders(event) });
  } catch (err: any) {
    return handleApiError(event, err);
  }
});
