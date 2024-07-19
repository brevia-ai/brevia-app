export default defineEventHandler(async (event) => {
  const document_id = event.context.params?.document_id;
  const client = await beditaApiClient(event);
  try {
    const response = await client.get(`/objects/${document_id}`);

    return breviaDocumentMetadata(response.data.data);
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
