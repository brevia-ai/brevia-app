import { UploadResourceType } from '@atlasconsulting/bedita-sdk';
import { MultiPartData } from 'h3';

const getFormData = (name: string, multiPartFormData: MultiPartData[]): MultiPartData => {
    const formData = multiPartFormData.find(item => item.name === name);
    if (!formData) {
        throw new Error(`Missing form data: ${name}`);
    }

    return formData;
};

export default defineEventHandler(async (event) => {
    try {
        const client = await beditaApiClient(event);
        const body = await readMultipartFormData(event) as MultiPartData[];

        const fileData = getFormData('file', body);
        const file = new File([fileData.data as BlobPart], fileData.filename || '', {
            type: fileData.type,
        });

        const type: UploadResourceType = getRouterParam(event, 'type') as UploadResourceType;
        const response = await client.upload(file, type);

        // humanzie title
        const id = response.data?.data?.id;
        const title = getFormData('title', body).data.toString();
        await client.patch(`/${type}/${id}`, {
            data: {
                id,
                type,
                attributes: {
                    title,
                },
            },
        });

        // create relation
        const relatedId = getFormData('relatedId', body).data.toString();
        const relatedType = getFormData('relatedType', body).data.toString();
        const relationName = getFormData('relationName', body).data.toString();

        await client.post(`/${relatedType}/${relatedId}/relationships/${relationName}`, {
            data: [
                {
                    type,
                    id,
                }
            ],
        });

        return response.formattedData;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
