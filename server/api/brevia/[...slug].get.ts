export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let url = `/${event.context?.params?.slug}`;
  if (url.startsWith('/api/brevia/')) {
    url = url.replace('/api/brevia', '');
  }
  try {
    return await apiFetch(url, { query }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
