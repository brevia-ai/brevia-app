import { breviaSessionConfig } from '~~/server/utils/session';
import type { H3Event } from 'h3';
import { useSession } from 'h3';

// Multi projects setup: update project configuration based on the current project
export const currentProject = async (event: H3Event): Promise<string | null> => {
  const config = useRuntimeConfig();

  if (!config.projects) {
    return null;
  }
  const session = await useSession(event, breviaSessionConfig());
  return session.data.project || null;
};
