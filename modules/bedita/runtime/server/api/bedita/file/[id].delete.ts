export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const client = await beditaApiClient(event);
    const response = await client.delete(`/files/${id}`);

    return response.formattedData;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
