export const beditaCollectionId = async (uuid: string, event: H3Event): Promise<string | null> => {
  const client = await beditaApiClient(event);
  const response = await client.get(`/collections?filter[collection_uuid]=${uuid}`);
  return response.data.data?.[0]?.id || null;
};

export const breviaDocumentMetadata = (object: any): any => {
  const commonMeta = { type: object.type };
  const attributes = {
    title: object.attributes.title,
    description: object.attributes.description,
    body: object.attributes.body,
  };

  let addMeta = {};
  if (object.type === 'files') {
    addMeta = {
      file: object.attributes.title,
      url: object.meta.media_url,
    };
  }
  if (object.type === 'links') {
    addMeta = {
      url: object.attributes.url,
    };
  }

  return {
    custom_id: object.id,
    created: object.meta.created,
    cmetadata: { ...commonMeta, ...addMeta },
    attributes,
  };
};

export const createCollectionDocument = async (
  type: string,
  collectionId: string,
  attributes: any,
  event: H3Event,
): Promise<any> => {
  const collectionBeditaId = await beditaCollectionId(collectionId, event);
  const client = await beditaApiClient(event);
  try {
    const response = await client.post(`/${type}`, {
      data: {
        type,
        attributes,
      },
    });

    const id = response.data?.data?.id;
    await client.post(`/collections/${collectionBeditaId}/relationships/has_documents`, {
      data: [
        {
          type,
          id,
        },
      ],
    });

    return response.formattedData;
  } catch (err: any) {
    console.log(err);
    return { error: err?.message || 'Unknown error' };
  }
};
