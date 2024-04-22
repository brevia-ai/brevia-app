<template>
<div class="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full h-full">
    <!-- backdrop -->
    <div class="fixed inset-0 bg-slate-700 bg-opacity-80 transition-opacity cursor-pointer"
        @click="(clickableOutside)?$closeModal():''"></div>

    <!-- main -->
    <div class="flex items-center sm:justify-center min-h-full p-3 sm:p-0">

        <!-- modal content -->
        <div class="pt-5 px-6 pb-6 space-y-6 relative w-full sm:max-w-lg bg-white rounded-lg shadow">
            <LazyDialogNewChatbot v-if="$isOpenModal('DialogNewChatbot')" />
            <LazyDialogEditMetadata v-if="$isOpenModal('DialogEditMetadata')" v-bind="modalStore.activeModalProps" />
            <LazyDialogDeleteChatbot v-if="$isOpenModal('DialogDeleteChatbot')" v-bind="modalStore.activeModalProps" />
            <LazyDialogChangePassword v-if="$isOpenModal('DialogChangePassword')" @stopClick="clickableOutside=false" />
            <LazyDialogDeleteAccount v-if="$isOpenModal('DialogDeleteAccount')" @stopClick="clickableOutside=false" />
            <LazyDialogShowFeedback v-if="$isOpenModal('ShowAnswerFeedback')" v-bind="modalStore.activeModalProps" />
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { useModalStore } from '~~/store/modal';
const modalStore = useModalStore();
const { $closeModal } = useNuxtApp();
let clickableOutside = ref(true);

onMounted(() => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $closeModal();
        }
    });
});
</script>
