import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
    state: () => ({
        activeModal: null as string | null,
        actveModalProps: {},
    }),

    actions: {
        openModal(component: string, props?: any) {
            this.activeModal = component;
            this.actveModalProps = props || {};
        },

        closeModal() {
            this.activeModal = null;
            this.actveModalProps = {};
        }
    },
});
