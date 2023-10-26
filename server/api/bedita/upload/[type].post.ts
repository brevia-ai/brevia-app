import { UploadResourceType } from '@atlasconsulting/bedita-sdk';
import { MultiPartData } from 'h3';

const getFormData = (name: string, multiPartFormData: MultiPartData[]): MultiPartData | undefined => multiPartFormData.find(item => item.name === name);

export default defineEventHandler(async (event) => {
    try {
        const client = await beditaApiClient(event);
        const body = await readMultipartFormData(event) as MultiPartData[];

        const fileData = getFormData('file', body);
        if (!fileData)
            throw new Error('Missing file');

        const file = new File([fileData.data as BlobPart], fileData.filename || '', { type: fileData.type });
        const type: UploadResourceType = getRouterParam(event, 'type') as UploadResourceType;

        // upload file
        const response = await client.upload(file, type);
        const id = response.data?.data?.id;

        // humanize title
        const title = getFormData('title', body)?.data.toString();
        if (title) {
            await client.patch(`/${type}/${id}`, {
                data: {
                    id,
                    type,
                    attributes: {
                        title,
                    },
                },
            });
        }

        // relation
        const relatedId = getFormData('relatedId', body)?.data.toString();
        const relatedType = getFormData('relatedType', body)?.data.toString();
        const relationName = getFormData('relationName', body)?.data.toString();

        if (relatedId && relatedType && relationName) {
            await client.post(`/${relatedType}/${relatedId}/relationships/${relationName}`, {
                data: [
                    {
                        type,
                        id,
                    }
                ],
            });
        }

        return response.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
