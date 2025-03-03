import type { H3Event } from 'h3';
import fs from 'fs';
import path from 'path';

function chatbotItems(response: any): Array<any> {
  return response.map((item: any) => {
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
    const featureItems = JSON.parse(fileContents);

    return featureItems.map((item: any) => {
      return {
        type: 'features',
        attributes: item,
      };
    });
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

export async function menuItems(event: H3Event): Promise<Array<any>> {
  const response: any = await apiFetch('/collections', {}, event);

  return featureItems().concat(chatbotItems(response));
}
