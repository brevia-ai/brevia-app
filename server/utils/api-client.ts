import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import type { H3Event } from 'h3';
import { currentProject } from './project';

export const apiBaseUrl = (event: H3Event, project: string | null = null): string => {
  const config = useRuntimeConfig(event);
  if (!project) {
    return config.apiBaseUrl;
  }

  const URL = config.projects?.[project]?.apiBaseUrl;
  if (!URL) {
    throw new Error(`API base URL not set in project "${project}"`);
  }
  return URL;
};

export const authorizationHeaders = (event: H3Event, project: string | null = null) => {
  return {
    Authorization: `Bearer ` + apiSecret(event, project),
  };
};

export const apiSecret = (event: H3Event, project: string | null = null): string | null => {
  const config = useRuntimeConfig(event);

  return project ? config.projects?.[project]?.apiSecret || null : config.apiSecret;
};

export const apiHeaders = (event: H3Event, json_content = false, custom = {}, project = null) => {
  const authHeader = authorizationHeaders(event, project);
  if (json_content) {
    return { ...authHeader, ...custom, ...{ 'Content-Type': 'application/json' } };
  }

  return { ...authHeader, ...custom };
};

export const apiUrl = (event: H3Event, path: string = '', project: string | null = null) => {
  return `${apiBaseUrl(event, project)}${path}`;
};

export const apiFetch = async (path: string, options: any, event: H3Event) => {
  const project = await currentProject(event);
  const headers = options.headers || {};
  const authHeader = authorizationHeaders(event, project);
  options.headers = { ...headers, ...authHeader };
  const url = apiUrl(event, path, project);

  return $fetch(url, options);
};
