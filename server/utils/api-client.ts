import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import type { H3Event } from 'h3';
import { currentProject } from './project';

export const apiBaseUrl = (project: string | null = null): string => {
  const config = useRuntimeConfig();
  if (!project) {
    return config.apiBaseUrl;
  }

  const URL = config.projects?.[project]?.apiBaseUrl;
  if (!URL) {
    throw new Error(`API base URL not set in project "${project}"`);
  }
  return URL;
};

export const authorizationHeaders = (project: string | null = null) => {
  return {
    Authorization: `Bearer ` + apiSecret(project),
  };
};

export const apiSecret = (project: string | null = null): string | null => {
  const config = useRuntimeConfig();

  return project ? config.projects?.[project]?.apiSecret || null : config.apiSecret;
};

export const apiHeaders = (json_content = false, custom = {}, project = null) => {
  const authHeader = authorizationHeaders(project);
  if (json_content) {
    return { ...authHeader, ...custom, ...{ 'Content-Type': 'application/json' } };
  }

  return { ...authHeader, ...custom };
};

export const apiUrl = (path: string = '', project: string | null = null) => {
  return `${apiBaseUrl(project)}${path}`;
};

export const apiFetch = async (path: string, options: any, event: H3Event) => {
  const project = await currentProject(event);
  const headers = options.headers || {};
  const authHeader = authorizationHeaders(project);
  options.headers = { ...headers, ...authHeader };
  const url = apiUrl(path, project);

  return $fetch(url, options);
};

export const handleApiError = async (
  event: H3Event,
  error: AxiosError | any,
): Promise<ApiResponseBodyError> => {
  console.error('API error:', error);
  if (isAxiosError(error) && error?.response) {
    setResponseStatus(event, error.response.status);

    return error.response.data;
  }

  setResponseStatus(event, error?.status || 500);

  return { error: error?.message || 'Some error occured :(' };
};
