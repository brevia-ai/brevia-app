/*
  This endpoint exists solely to override the layer and to prevent errors in multi-project configurations.
*/

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = `/chat_history`;
  try {
    return await apiFetch(url, { query }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
