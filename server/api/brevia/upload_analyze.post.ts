import { FormData } from 'node-fetch-native';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const url = config.apiBaseUrl + '/upload_analyze';
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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + config.apiSecret,
      },
      body: formData,
    });

    const respBody = await response.json();
    if (!response.ok) {
      return {
        error: respBody?.detail,
        status: response.status,
      };
    }
    return respBody;
  } catch (err) {
    console.log(err);
    return { error: err?.message || 'Unknown error' };
  }
});
