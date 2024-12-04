import { apiFetch } from '~/server/utils/api-client';
import { H3Event } from 'h3';

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
