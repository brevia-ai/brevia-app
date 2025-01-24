export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = `/${event.context?.params?.slug}`;
  try {
    return await apiFetch(url, { query }, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
