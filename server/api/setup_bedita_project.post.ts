export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const project = body?.project;
    if (!project) {
      return { error: 'Project not found' };
    }
    const config = useRuntimeConfig();
    const session = await useSession(event, beditaSessionConfig());
    const bedita = {
      apiBaseUrl: config.projects?.[project]?.bedita?.apiBaseUrl,
      apiKey: config.projects?.[project]?.bedita?.apiKey,
    };
    await session.update({ bedita });
  } catch (err: any) {
    return { error: err?.message || 'Unknown error' };
  }
});
