import type { ApiResponseBodyOk, JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export interface ApiResponseResource extends ApiResponseBodyOk {
  formattedData: {
    data: JsonApiResourceObject | Record<string, never>;
  };
}

export interface ApiResponseList extends ApiResponseBodyOk {
  formattedData: {
    data: JsonApiResourceObject[] | [];
  };
}
