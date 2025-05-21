export default defineEventHandler(async (event) => {
  let url = `/${event.context?.params?.slug}`;
  if (url.startsWith('/api/brevia/')) {
    url = url.replace('/api/brevia', '');
  }
  const body = await readBody(event);
  try {
    return await apiFetch(url, { method: 'POST', body }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
