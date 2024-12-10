export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await apiFetch(`/collections/${id}`, { method: 'DELETE' }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
