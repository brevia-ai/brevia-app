import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    activeModal: null as string | null,
    activeModalProps: {},
    isLoadingPage: false,
  }),

  actions: {
    openModal(component: string, props?: any) {
      this.activeModal = component;
      this.activeModalProps = props || {};
    },

    closeModal() {
      this.activeModal = null;
      this.activeModalProps = {};
    },
  },
});
