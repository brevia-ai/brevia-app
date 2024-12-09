export default defineEventHandler(async (event) => {
  try {
    return await $fetch(apiUrl('/config/schema'), { headers: authorizationHeaders()});
  } catch (err: any) {
    return handleApiError(event, err);
  }
});
