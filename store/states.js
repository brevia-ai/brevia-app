import { defineStore } from 'pinia';

export const useStatesStore = defineStore('states', {
    state: () => ({
        isLogged: false,
        options: {},
        user: null,
    }),

    actions: {
        userLogin(user) {
            this.isLogged = true;
            this.user = user;
        },

        userLogout() {
            this.isLogged = false;
            this.user = null;
        },

        /**
         * Verify if user has access to internal link, redirect to `/` if not
         * @param {string} link
         * @returns {void}
         */
        userAccess(link) {
            const menu = this.getMenu();
            const found = menu.find(m => m.link === link);
            if (found) {
                return;
            }
            console.warn(`Forbidden access to ${link}`);
            navigateTo('/');
        },

        getMenuItem(link) {
            const menu = this.getMenu();
            return menu.find(m => m.link === link);
        },

        setIsLogged(value = true) {
            this.isLogged = value;
        },

        getMenu() {
            return JSON.parse(localStorage.getItem('chatlas-menu') || '[]');
        },

        getJobInfo(name) {
            return JSON.parse(localStorage.getItem(name)) || null;
        },

        setJobInfo(name, value) {
            if (!value) {
                localStorage.removeItem(name);
                return;
            }
            localStorage.setItem(name, JSON.stringify(value));
        },

        readOptions() {
            this.options = JSON.parse(localStorage.getItem('chatlas-options') || '{}');
        },

        setMenu(menu) {
            if (!menu) {
                localStorage.removeItem('chatlas-menu');
                return;
            }

            localStorage.setItem('chatlas-menu', JSON.stringify(menu));
        },

        setOptions(options) {
            if (!options) {
                this.options = {};
                localStorage.removeItem('chatlas-options');
                return;
            }

            this.options = options;
            localStorage.setItem('chatlas-options', JSON.stringify(options));
        },
    },
});
