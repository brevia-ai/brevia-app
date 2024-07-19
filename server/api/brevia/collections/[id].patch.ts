export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = getRouterParam(event, 'id');
    await $fetch(apiUrl(`/collections/${id}`), {
      method: 'PATCH',
      headers: apiHeaders(true),
      body,
    });
  } catch (error) {
    return handleApiError(event, error);
  }
});
