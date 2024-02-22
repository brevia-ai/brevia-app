import { ItemEditLevel } from '~~/store/states';

export interface UserDataStore {
    id: string,
    name: string,
    surname: string,
    roles: string[],
    meta: object,
    username: string,
}

export const userEditLevel = (item: any): ItemEditLevel => {
    const { user } = useBeditaAuth()
    console.log('item', item);
    const relationEditLevel = item?.meta?.relation?.params?.edit_level || null;
    if (relationEditLevel == 'read_write') {
        return ItemEditLevel.ReadWrite;
    }
    if (relationEditLevel == 'read_only') {
        return ItemEditLevel.ReadOnly;
    }
    const createdId = item?.meta?.created_by;
    if (user.value?.id == createdId) {
        return ItemEditLevel.ReadWrite;
    }

    return ItemEditLevel.None
};

// TODO: move somewhere?
const extractBeditafield = (obj: any, field: string) => {
    return obj?.attributes?.[field] || obj?.meta?.[field] || '';
};

export const buildUserMenu = (hasAccess: any) => {
    const items = [];
    for (const item of hasAccess) {
        const type = item?.type === 'collections'? 'chatbot' : item?.attributes?.feature_type || '';
        const link = item?.type === 'collections'? `/chatbot/${item?.attributes?.uname}` : `/${item?.attributes?.feature_type}/${item?.attributes?.uname}`;
        let params = null;
        if (item?.type === 'features') {
            params = item?.attributes?.feature_params || {};
            if (!('payload' in params)) {
                params['payload'] = {};
            }
            params['payload']['prompts'] = item?.attributes?.prompts || null;
        }

        items.push({
            link,
            type,
            title: extractBeditafield(item, 'title'),
            description: extractBeditafield(item, 'description'),
            params,
            edit: userEditLevel(item),
        });
    }

    return items;
};
