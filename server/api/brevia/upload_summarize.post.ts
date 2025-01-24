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
  }

  const project = await currentProject(event);
  const options = {
    method: 'POST',
    headers: authorizationHeaders(event, project),
    body: formData,
  };
  try {
    const response = await fetch(apiUrl(event, '/upload_summarize', project), options);
    const respBody = await response.json();
    if (!response.ok) {
      return {
        error: respBody?.detail,
        status: response.status,
      };
    }
    return respBody;
  } catch (error) {
    return handleApiError(event, error);
  }
});
