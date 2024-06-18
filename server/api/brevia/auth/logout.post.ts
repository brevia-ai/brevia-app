import { getSessionConfig } from '~~/server/utils/session';

// Dummy implementation of a user logout -> this must be changed for your app/platform/cms of choice
export default defineEventHandler(async (event) => {
    try {
        const session = await useSession(event, getSessionConfig());
        await session.update({user: null});
    } catch (error) {
        return handleApiError(event, error);
    }
});
