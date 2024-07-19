import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import type { H3Event } from 'h3';

export const authorizationHeaders = () => {
  return {
    Authorization: `Bearer ` + useRuntimeConfig().apiSecret,
  };
};

export const apiHeaders = (json_content = false, custom = {}) => {
  const authHeader = authorizationHeaders();
  if (json_content) {
    return { ...authHeader, ...custom, ...{ 'Content-Type': 'application/json' } };
  }

  return { ...authHeader, ...custom };
};

export const apiUrl = (path = '') => {
  const config = useRuntimeConfig();
  return `${config.apiBaseUrl}${path}`;
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
