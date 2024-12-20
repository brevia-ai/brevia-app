export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = getRouterParam(event, 'id');
    const options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body,
    };
    await apiFetch(`/collections/${id}`, options, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
