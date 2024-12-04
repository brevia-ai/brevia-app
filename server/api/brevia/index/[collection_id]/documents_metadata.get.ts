const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const collection_id = event.context.params?.collection_id;
  const query = getQuery(event);
  try {
    return await apiFetch(
      `/index/${collection_id}/documents_metadata`,
      { method: 'GET', query },
      event
    );
  } catch (error) {
    return handleApiError(event, error);
  }
});
