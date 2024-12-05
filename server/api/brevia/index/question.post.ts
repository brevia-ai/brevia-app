import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.document_id) {
      body.document_id = uuidv4();
    }
    body.content = `${body.title}\n${body.answer}`;
    delete body.title;
    delete body.answer;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    };

    return await apiFetch('/index', options, event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
