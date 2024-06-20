import { type SessionConfig } from 'h3';

export const breviaSessionConfig = (): SessionConfig => {
    const config = useRuntimeConfig();

    return {
        password: config.brevia.session.secret,
        name: config.brevia.session.name,
    } as SessionConfig;
}

export const beditaSessionConfig = (): SessionConfig => {
    const config = useRuntimeConfig();

    return {
        password: config.bedita.session.secret,
        name: config.bedita.session.name,
    } as SessionConfig;
}
