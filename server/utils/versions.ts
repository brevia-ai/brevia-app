import type { H3Event } from 'h3';

export interface ApiVersions {
  brevia: string | null;
  apiName: string | null;
  apiVersion: string | null;
  baseUrl: string;
}

export async function apiVersions(event: H3Event): Promise<ApiVersions> {
  const project = await currentProject(event);
  const response: Response = await fetch(apiUrl(event, '/status', project), {
    method: 'HEAD',
    headers: apiHeaders(event),
  });

  return {
    brevia: response.headers?.get('X-Brevia-Version') || null,
    apiName: response.headers?.get('X-API-Name') || null,
    apiVersion: response.headers?.get('X-API-Version') || null,
    baseUrl: apiBaseUrl(event),
  };
}
