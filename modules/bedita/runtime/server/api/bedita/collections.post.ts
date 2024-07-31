export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const client = await beditaApiClient(event);
    const responseCollection = await client.post('/collections', {
      data: {
        type: 'collections',
        attributes: body.cmetadata,
      },
    });

    const id = responseCollection.data?.data?.id;
    const user = await client.getStorageService().get('user');

    await client.post(`/collections/${id}/relationships/accessed_by`, {
      data: [
        {
          type: 'users',
          id: user.id,
          meta: {
            relation: {
              params: {
                edit_level: 'read_write',
              },
            },
          },
        },
      ],
    });

    const attr = responseCollection.formattedData.data.attributes;
    const meta = responseCollection.formattedData.data.meta;

    return {
      name: attr.uname,
      uuid: meta.collection_uuid,
      cmetadata: {
        ...attr,
      },
    };
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
