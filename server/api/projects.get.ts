export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const projects = config.projects ? Object.keys(config.projects) : [];

    return projects;
  } catch (error) {
    return handleApiError(event, error);
  }
});
