import { ItemEditLevel, type menuItem } from '~~/store/states';

export interface UserCredentials {
  name?: string;
  surname?: string;
  roles?: string[];
  username: string;
  password: string;
}

export interface UserDataStore {
  id?: string;
  name?: string;
  surname?: string;
  roles: string[];
  meta?: object;
  username: string;
}

export const userEditLevel = (item: any): ItemEditLevel => {
  const editLevel = extractField(item, 'edit_level');
  if (editLevel == 'read_write') {
    return ItemEditLevel.ReadWrite;
  }
  if (editLevel == 'read_only') {
    return ItemEditLevel.ReadOnly;
  }

  return ItemEditLevel.None;
};

export const extractField = (obj: any, field: string) => {
  return obj?.attributes?.[field] || obj?.meta?.[field] || obj?.[field] || '';
};

export const buildUserMenu = (menu: any): Array<menuItem> => {
  const items = [];
  for (const item of menu) {
    const type = item?.type === 'collections' ? 'chatbot' : item?.attributes?.feature_type || '';
    const link =
      item?.type === 'collections'
        ? `/chatbot/${item?.attributes?.uname}`
        : `/${item?.attributes?.feature_type}/${item?.attributes?.uname}`;
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
      title: extractField(item, 'title'),
      description: extractField(item, 'description'),
      params,
      edit: userEditLevel(item),
    });
  }

  return items;
};
