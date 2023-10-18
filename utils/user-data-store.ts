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
