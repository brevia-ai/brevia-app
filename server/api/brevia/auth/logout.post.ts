import { breviaSessionConfig } from '~~/server/utils/session';

// Dummy implementation of a user logout -> this must be changed for your app/platform/cms of choice
export default defineEventHandler(async (event) => {
  try {
    const session = await useSession(event, breviaSessionConfig());
    await session.update({ user: null, project: null });
  } catch (error) {
    return handleApiError(event, error);
  }
});
