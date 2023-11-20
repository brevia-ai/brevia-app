import { UserDataStore } from './../utils/user-data-store';
import { defineStore } from 'pinia';

export enum ItemEditLevel {
    ReadWrite = 'READ_WRITE',
    ReadOnly = 'READ_ONLY',
    None = 'NONE',
}

export interface menuItem {
    link: string;
    type: string;
    title: string;
    description: string;
    params: any;
    edit: ItemEditLevel;
}

export const useStatesStore = defineStore('states', {
    state: () => ({
        isLogged: false,
        user: null as UserDataStore | null,
        menu: [] as menuItem[],
    }),

    actions: {
        userLogin(user: UserDataStore) {
            this.isLogged = true;
            this.user = user;
        },

        userLogout() {
            this.isLogged = false;
            this.user = null;
            this.menu = [];
        },

        /**
         * Verify if user has access to internal link, redirect to `/` if not
         */
        userAccess(link: string) {
            const found = this.menu.find(m => m.link === link);
            if (found) {
                return;
            }

            console.warn(`Forbidden access to ${link}`);
            navigateTo('/');
        },

        getMenuItem(link: string) {
            return this.menu.find(m => m.link === link);
        },

        setIsLogged(value = true) {
            this.isLogged = value;
        },

        getJobInfo(name: string) {
            const item = localStorage.getItem(name);
            if (item === null)
                return null;

            return JSON.parse(item);
        },

        setJobInfo(name: string, value: any) {
            if (!value) {
                localStorage.removeItem(name);
                return;
            }

            localStorage.setItem(name, JSON.stringify(value));
        },
    },
});
