import type { H3Event, SessionConfig } from 'h3';
import { useIntegration } from '~~/composables/integration';

export const breviaSessionConfig = (event: H3Event): SessionConfig => {
  const config = useRuntimeConfig(event);

  return {
    password: config.brevia.session.secret,
    name: config.brevia.session.name,
  } as SessionConfig;
};

export const beditaSessionConfig = (event: H3Event): SessionConfig => {
  const config = useRuntimeConfig(event);

  return {
    password: config.bedita.session.secret,
    name: config.bedita.session.name,
  } as SessionConfig;
};

export const sessionConfig = (event: H3Event): SessionConfig => {
  const integration = useIntegration();
  return integration == 'brevia' ? breviaSessionConfig(event) : beditaSessionConfig(event);
};
