
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    return await apiFetch('/chat_history', { query }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
