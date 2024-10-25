import { authorizationHeaders, apiUrl } from '~/server/utils/api-client';
import fs from 'fs';
import path from 'path';

function chatbotItems(response): Array<any> {
  return response.map((item) => {
    return {
      type: 'collections',
      attributes: {
        uname: item.name,
        title: item.cmetadata?.title,
        description: item.cmetadata?.description,
        edit_level: 'read_write',
      },
    };
  });
}

function featureItems() {
  const jsonFeatureItemsPath = path.resolve(process.cwd(), 'feature_items.json');
  if (fs.existsSync(jsonFeatureItemsPath)) {
    const fileContents = fs.readFileSync(jsonFeatureItemsPath, 'utf8');
    return JSON.parse(fileContents);
  }

  return [
    {
      type: 'features',
      attributes: {
        feature_type: 'summary',
        uname: 'summary',
        title: 'Document Summary',
        description: 'Description of document summary',
      },
    },
  ];
}

export async function menuItems() {
  const response: any = await $fetch(apiUrl('/collections'), {
    method: 'GET',
    headers: authorizationHeaders(),
  });

  return featureItems().concat(chatbotItems(response));
}
