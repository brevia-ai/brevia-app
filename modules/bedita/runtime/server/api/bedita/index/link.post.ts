export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const attributes = {
    url: body.link,
    title: body.link,
    extra: {
      brevia: {
        metadata: body.metadata,
        options: body.options,
      },
    },
  };

  return createCollectionDocument('links', body.collection_id, attributes, event);
});
