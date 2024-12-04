export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const title = body.cmetadata?.title || Math.random().toString(36).substring(2, 12);
    body.name = title.toLowerCase().replaceAll(' ', '-') || '';
    return await apiFetch('/collections', { method: 'POST', body }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
