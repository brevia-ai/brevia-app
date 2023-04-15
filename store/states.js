import { defineStore } from 'pinia';

export const useStatesStore = defineStore('states', {
    state: () => ({
        isLogged: false,
        menu: [],
    }),

    actions: {
        userLogin(menu) {
            if (!process.client) return;

            localStorage.setItem('menu', JSON.stringify(menu));
            this.isLogged = true;
            navigateTo('/');
        },

        userLogout() {
            if (!process.client) return;

            localStorage.removeItem('menu');
            this.isLogged = false;
            navigateTo('/auth');
        },

        setIsLogged(value = true) {
            this.isLogged = value;
        }
    },
});
