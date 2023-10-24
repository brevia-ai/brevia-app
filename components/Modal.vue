<template>
<div class="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full h-full">
    <!-- backdrop -->
    <div class="fixed inset-0 bg-slate-700 bg-opacity-80 transition-opacity cursor-pointer"
        @click="$closeModal"></div>

    <!-- main -->
    <div class="flex items-center sm:justify-center min-h-full p-3 sm:p-0">

        <!-- modal content -->
        <div class="pt-5 px-6 pb-6 space-y-6 relative w-full sm:max-w-lg bg-white rounded-lg shadow">

            <DialogNewChatbot    v-if="$isOpenModal('create-chatbot')" />
            <DialogDeleteChatbot v-if="$isOpenModal('delete-chatbot')" />

        </div>
    </div>
</div>
</template>
