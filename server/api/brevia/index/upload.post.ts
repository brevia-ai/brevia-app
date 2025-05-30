import { v4 as uuidv4 } from 'uuid';
import { FormData } from 'node-fetch-native';

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const formData = new FormData();
  if (form) {
    form.forEach((item) => {
      if (!item.name) {
        return;
      }
      if (!item.filename) {
        formData.append(item.name, item.data.toString());
      } else {
        formData.append(item.name, new Blob([item.data], { type: item.type }), item.filename);
      }
    });
    if (!formData.get('document_id')) {
      formData.append('document_id', uuidv4());
    }
  }
  const project = await currentProject(event);
  const options = {
    method: 'POST',
    headers: authorizationHeaders(event, project),
    body: formData,
  };
  try {
    const response = await fetch(apiUrl(event, '/index/upload', project), options);
    if (!response.ok) {
      return handleApiError(event, response);
    }
  } catch (err) {
    return handleApiError(event, err);
  }
});
