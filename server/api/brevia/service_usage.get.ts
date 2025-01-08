export default defineEventHandler(async (event) => {
  // This endpoint is available only in Playground API
  const query = getQuery(event);

  try {
    return await apiFetch('/service_usage', { query }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
