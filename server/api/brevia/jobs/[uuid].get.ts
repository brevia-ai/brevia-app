
export default defineEventHandler(async (event) => {
  const uuid = event.context.params?.uuid;
  if (!uuid) {
    return { error: 'Missing job uuid' };
  }
  try {
    return await apiFetch(`/jobs/${uuid}`, {}, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
