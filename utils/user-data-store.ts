import { ItemEditLevel } from '~~/store/states';

export interface UserDataStore {
    id: string,
    name: string,
    surname: string,
    roles: string[],
    meta: object,
    username: string,
}

export const filterUserDataToStore = (data: any): UserDataStore => ({
    id: data?.data?.id,
    name: data?.data?.attributes?.name,
    surname: data?.data?.attributes?.surname,
    roles: data?.roles || [],
    meta: data?.data?.meta || {},
    username: data?.data?.attributes?.username,
});

export const userEditLevel = (item: any): ItemEditLevel => {
    const store = useStatesStore();
    const userId = store.user?.id;
    const createdId = item?.meta?.created_by;
    if (userId == createdId) {
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
