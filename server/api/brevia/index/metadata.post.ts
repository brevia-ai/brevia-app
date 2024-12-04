
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }

  try {
    await apiFetch('/index/metadata', options, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
