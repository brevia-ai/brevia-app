export default defineEventHandler(async (event) => {
  const collection_id = event.context.params?.collection_id;
  const document_id = event.context.params?.document_id;
  try {
    return await apiFetch(`/index/${collection_id}/${document_id}`, { method: 'GET' }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
