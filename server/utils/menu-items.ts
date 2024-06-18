import { buildUserMenu } from '~~/utils/user-data-store';
import { authorizationHeaders, apiUrl } from '~/server/utils/api-client';

function chatbotItems(response): Array<any> {
    return response.map(item => {
        return {
            type: 'collections',
            attributes: {
                uname: item.name,
                title: item.cmetadata?.title,
                description: item.cmetadata?.description,
                edit_level: 'read_write',
            },
        };
    })
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
        }
    ];
}

export async function menuItems() {
    const response: any = await $fetch(apiUrl('/collections'), {
        method: 'GET',
        headers: authorizationHeaders(),
    });

    return buildUserMenu(featureItems().concat(chatbotItems(response)));
}
