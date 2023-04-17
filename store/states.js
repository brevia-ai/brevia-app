import { defineStore } from 'pinia';

export const useStatesStore = defineStore('states', {
    state: () => ({
        isLogged: false,
        menu: [],
    }),

    actions: {
        userLogin(menu) {
            this.setMenu(menu);
            this.isLogged = true;
            navigateTo('/');
        },

        userLogout() {
            this.setMenu(null);
            this.isLogged = false;
            navigateTo('/auth');
        },

        setIsLogged(value = true) {
            this.isLogged = value;
        },

        getMenu() {
            return JSON.parse(localStorage.getItem('chatlas-menu') || '[]');
        },

        setMenu(menu) {
            if (!menu) {
                localStorage.removeItem('chatlas-menu');
                return;
            }

            localStorage.setItem('chatlas-menu', JSON.stringify(menu));
        },
    },
});
