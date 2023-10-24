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
        options: {},
        user: null as UserDataStore | null,
        menu: [] as menuItem[],
        activeModal: null as string | null,
    }),

    actions: {
        userLogin(user: UserDataStore) {
            this.isLogged = true;
            this.user = user;
        },

        userLogout() {
            this.isLogged = false;
            this.user = null;
        },

        /**
         * Verify if user has access to internal link, redirect to `/` if not
         */
        userAccess(link: string) {
            const menu = this.getMenu();
            const found = menu.find(m => m.link === link);
            if (found) {
                return;
            }
            console.warn(`Forbidden access to ${link}`);
            navigateTo('/');
        },

        getMenuItem(link: string) {
            const menu = this.getMenu();
            return menu.find(m => m.link === link);
        },

        getMenu(): menuItem[] {
            if (!this.menu.length) {
                this.menu = JSON.parse(localStorage.getItem('chatlas-menu') || '[]');
            }

            return this.menu;
        },

        setMenu(menu: menuItem[]) {
            if (!menu) {
                this.menu = [];
                localStorage.removeItem('chatlas-menu');
                return;
            }

            this.menu = menu;
            localStorage.setItem('chatlas-menu', JSON.stringify(menu));
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

        readOptions() {
            this.options = JSON.parse(localStorage.getItem('chatlas-options') || '{}');
        },

        setOptions(options: any) {
            if (!options) {
                this.options = {};
                localStorage.removeItem('chatlas-options');
                return;
            }

            this.options = options;
            localStorage.setItem('chatlas-options', JSON.stringify(options));
        },

        openModal(modal: string) {
            this.activeModal = modal;
        },

        closeModal() {
            this.activeModal = null;
        }
    },
});
