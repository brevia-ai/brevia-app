/*
This endpoint exists solely to be overridden by the layer and to prevent errors in multi-project configurations.
*/

export default defineEventHandler(async (event) => {
  const url = `/${event.context?.params?.slug}`;
  const body = await readBody(event);
  try {
    return await apiFetch(url, { method: 'POST', body }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
