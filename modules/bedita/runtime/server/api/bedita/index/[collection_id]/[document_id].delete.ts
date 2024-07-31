export default defineEventHandler(async (event) => {
  const document_id = event.context.params?.document_id;
  const client = await beditaApiClient(event);
  try {
    await client.delete(`/objects/${document_id}`);
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
