import { SessionConfig } from 'h3';

export const getSessionConfig = (): SessionConfig => {
    const config = useRuntimeConfig();

    return {
        password: config.session.secret,
        name: config.session.name,
    } as SessionConfig;
}
