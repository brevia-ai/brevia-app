import { breviaSessionConfig } from '~~/server/utils/session';

// Dummy implementation of a user login -> this must be changed for your app/platform/cms of choice
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const body = await readBody(event);
    let authCredentials: UserCredentials[];
    if (typeof config.brevia.authCredentials === 'string') {
      authCredentials = JSON.parse(config.brevia.authCredentials);
    } else {
      authCredentials = config.brevia.authCredentials as UserCredentials[];
    }
    const credentials = authCredentials.find((item) => {
      return item.username === body?.username && item.password === body?.password;
    });
    if (!credentials) {
      return handleApiError(event, { message: 'Invalid credentials', status: 401 });
    }
    const user: UserDataStore = {
      name: credentials.name,
      surname: credentials.surname,
      roles: credentials.roles || ['admin'], // assume admin role if not provided
      username: credentials.username,
    };
    const session = await useSession(event, breviaSessionConfig());
    await session.update({ user });

    return user;
  } catch (error) {
    return handleApiError(event, error);
  }
});
