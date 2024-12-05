export default defineEventHandler(async (event) => {
  const collection_id = event.context.params?.collection_id;
  const query = getQuery(event);
  try {
    return await apiFetch(`/index/${collection_id}`, { method: 'GET', query }, event);
  } catch (err) {
    return handleApiError(event, err);
  }
});
