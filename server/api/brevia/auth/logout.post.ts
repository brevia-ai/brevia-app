import { breviaSessionConfig } from '~~/server/utils/session';

// Dummy implementation of a user logout -> this must be changed for your app/platform/cms of choice
export default defineEventHandler(async (event) => {
  try {
    const session = await useSession(event, breviaSessionConfig(event));
    await session.update({ ...session.data, ...{ user: null, _project: null } });
  } catch (error) {
    return handleApiError(event, error);
  }
});
