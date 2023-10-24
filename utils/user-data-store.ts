import { ItemEditLevel } from '~~/store/states';

export interface UserDataStore {
    id: string,
    name: string,
    surname: string,
    roles: string[],
}

export const filterUserDataToStore = (data: any): UserDataStore => ({
    id: data?.data?.id,
    name: data?.data?.attributes?.name,
    surname: data?.data?.attributes?.surname,
    roles: data?.roles || [],
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
