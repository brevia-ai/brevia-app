import { sessionConfig } from '~~/server/utils/session';
import type { H3Event } from 'h3';
import { useSession } from 'h3';

// Multi projects setup: update project configuration based on the current project
export const currentProject = async (event: H3Event): Promise<string | null> => {
  const config = useRuntimeConfig(event);

  if (!config.projects) {
    return null;
  }
  const session = await useSession(event, sessionConfig(event));
  return session.data._project || null;
};
