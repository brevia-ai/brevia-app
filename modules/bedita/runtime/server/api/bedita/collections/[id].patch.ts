export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    // BEdita ID in cmetadata
    const id = body.cmetadata.id;
    const client = await beditaApiClient(event);
    const response = await client.patch(`/collections/${id}`, {
      data: {
        id: `${id}`,
        type: 'collections',
        attributes: body.cmetadata,
      },
    });

    return response.formattedData;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
