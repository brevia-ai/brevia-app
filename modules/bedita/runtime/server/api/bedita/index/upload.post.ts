import { UploadResourceType } from '@atlasconsulting/bedita-sdk';
import { File } from "@web-std/file"
import { MultiPartData } from 'h3';

const getFormData = (multiPartFormData: MultiPartData[]) : Map<string |undefined, MultiPartData> => new Map(multiPartFormData.map(item => [item.name, item]));

export default defineEventHandler(async (event) => {
    try {
        const client = await beditaApiClient(event);
        const formData = await readMultipartFormData(event) as MultiPartData[];
        const formDataMap = getFormData(formData);

        const file = formDataMap.get('file');
        if (!file?.data)
            throw new Error('Missing file');
        const collectionId = formDataMap.get('collection_id')?.data?.toString();
        if (!collectionId) {
            throw new Error('Missing collection ID');
        }

        const fileObject = new File([file.data as BlobPart], file.filename || '', { type: file.type });

        const options = formDataMap.get('options')?.data ?
            JSON.parse(formDataMap.get('options')?.data?.toString() || '') : null;
        const metadata = formDataMap.get('metadata')?.data ?
            JSON.parse(formDataMap.get('metadata')?.data?.toString() || '') : null;

        const type: UploadResourceType = metadata.type as UploadResourceType;

        // upload file
        const response = await client.upload(fileObject, type);
        const id = response.data?.data?.id;

        const attributes = {
            extra: {
                brevia: {
                    metadata,
                    options,
                },
            },
        };
        const response2 = await client.patch(`/${type}/${id}`, {
            data: { id, type, attributes }
        });

        const collectionBeditaId = await beditaCollectionId(collectionId, event);
        await client.post(`/collections/${collectionBeditaId}/relationships/has_documents`, {
            data: [
                {
                    type,
                    id,
                }
            ],
        });

        return response2.formattedData;

    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
