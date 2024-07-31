import type { UploadResourceType } from '@atlasconsulting/bedita-sdk';
import type { MultiPartData } from 'h3';

const getFormData = (multiPartFormData: MultiPartData[]): Map<string | undefined, MultiPartData> =>
  new Map(multiPartFormData.map((item) => [item.name, item]));

export default defineEventHandler(async (event) => {
  try {
    const client = await beditaApiClient(event);
    const formData = (await readMultipartFormData(event)) as MultiPartData[];
    const formDataMap = getFormData(formData);

    const file = formDataMap.get('file');
    if (!file?.data) throw new Error('Missing file');

    const fileObject = new File([file.data as BlobPart], file.filename || '', { type: file.type });
    const type: UploadResourceType = getRouterParam(event, 'type') as UploadResourceType;

    // upload file
    const response = await client.upload(fileObject, type);
    const id = response.data?.data?.id;

    // update object attributes (title, description & extra)
    const extra = formDataMap.get('extra')?.data
      ? JSON.parse(formDataMap.get('extra')?.data?.toString() || '')
      : null;
    const fileAttr = {
      title: formDataMap.get('title')?.data.toString() || null,
      description: formDataMap.get('description')?.data.toString() || null,
      extra,
    };
    const attributes = Object.fromEntries(Object.entries(fileAttr).filter(([, v]) => v !== null));
    if (attributes) {
      await client.patch(`/${type}/${id}`, {
        data: { id, type, attributes },
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
          },
        ],
      });
    }

    return response.formattedData;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
