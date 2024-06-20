import { breviaSessionConfig } from '~~/server/utils/session';

// Dummy implementation of a user login -> this must be changed for your app/platform/cms of choice
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    try {
        const body = await readBody(event);
        let authCredentials = config.brevia.authCredentials;
        if (typeof authCredentials === 'string') {
            authCredentials = JSON.parse(authCredentials);
        }
        let user = authCredentials.find(item => {
            return item.username === body?.username && item.password === body?.password
        });
        if (!user) {
            return handleApiError(event, {message: 'Invalid credentials', status: 401});
        }
        const session = await useSession(event, breviaSessionConfig());
        await session.update({user});

        return user;
    } catch (error) {
        return handleApiError(event, error);
    }
});
