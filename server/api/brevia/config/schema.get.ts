export default defineEventHandler(async (event) => {
  try {
    return await $fetch(apiUrl(event, '/config/schema'), { headers: authorizationHeaders(event) });
  } catch (err: any) {
    return handleApiError(event, err);
  }
});
