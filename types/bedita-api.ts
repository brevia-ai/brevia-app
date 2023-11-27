import { ApiResponseBodyOk, JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export interface ApiResponseResource extends ApiResponseBodyOk {
    formattedData: {
        data: JsonApiResourceObject | {},
    },
}

export interface ApiResponseList extends ApiResponseBodyOk {
    formattedData: {
        data: JsonApiResourceObject[] | [],
    },
}
