import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.document_id) {
    body.document_id = uuidv4();
  }

  try {
    return await apiFetch(
      '/index/link',
      { method: 'POST', body },
      event
    );
  } catch (error) {
    return handleApiError(event, error);
  }
});
