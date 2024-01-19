import { UploadResourceType } from '@atlasconsulting/bedita-sdk';
import { MultiPartData } from 'h3';

const getFormData = (multiPartFormData: MultiPartData[]) : Map<string |undefined, MultiPartData> => new Map(multiPartFormData.map(item => [item.name, item]));

export default defineEventHandler(async (event) => {
    try {
        const client = await beditaClient(event);
        const formData = await readMultipartFormData(event) as MultiPartData[];
        const formDataMap = getFormData(formData);

        const file = formDataMap.get('file');
        if (!file?.data)
            throw new Error('Missing file');

        const fileObject = new File([file.data as BlobPart], file.filename || '', { type: file.type });
        const type: UploadResourceType = getRouterParam(event, 'type') as UploadResourceType;

        // upload file
        const response = await client.upload(fileObject, type);
        const id = response.data?.data?.id;

        // title and description
        const title = formDataMap.get('title')?.data.toString();
        if (title) {
            await client.patch(`/${type}/${id}`, {
                data: { id, type, attributes: { title } }
            });
        }
        const description = formDataMap.get('description')?.data.toString();
        if (description) {
            await client.patch(`/${type}/${id}`, {
                data: { id, type, attributes: { description } }
            });
        }

        // relation
        const relatedId = formDataMap.get('relatedId')?.data.toString();
        const relatedType = formDataMap.get('relatedType')?.data.toString();
        const relationName = formDataMap.get('relationName')?.data.toString();

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
