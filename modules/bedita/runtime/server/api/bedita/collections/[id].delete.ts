export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const collectionId = await beditaCollectionId(String(id), event);
    if (!collectionId) {
      return handleBeditaApiError(event, Error('Collection not found'));
    }
    const client = await beditaApiClient(event);

    await client.delete(`/collections/${collectionId}`);
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
