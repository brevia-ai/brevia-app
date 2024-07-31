export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await $fetch(body?.url);
  } catch (err: any) {
    return { error: err?.message || 'Unknown error' };
  }
});
