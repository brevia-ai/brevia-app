import { useModalStore } from '~~/store/modal';

export default defineNuxtPlugin(async nuxtApp => {
    const modalStore = useModalStore();

    return {
        provide: {
            openModal(modal, props = {}) {
                modalStore.openModal(modal, props);
            },

            closeModal() {
                modalStore.closeModal();
            },

            isActiveModal() {
                return !!modalStore.activeModal;
            },

            isOpenModal(modal) {
                return modalStore.activeModal === modal;
            },

            // converts HTML to text
            // TODO: implement rich text editor or for more advanced convertion https://www.npmjs.com/package/html-to-text
            html2text(html) {
                if (!html)
                    return '';

                return new DOMParser().parseFromString(html, "text/html").documentElement.textContent || '';
            },

            fileName2title(fileName) {
                if (!fileName)
                    return '';

                fileName = fileName.replace(/[_-]/g, ' ');
                fileName = fileName.replace(/\.[^/.]+$/, '');

                return fileName.charAt(0).toUpperCase() + fileName.slice(1);
            },

            // Format Date to 'YYYY-MM-DD' format
            formatDate(date) {
                if(!date) {
                    return ''
                }
                date.setHours(12); // avoid timezone issues
                return date.toISOString().slice(0, 10);
            },
        }
    }
});
