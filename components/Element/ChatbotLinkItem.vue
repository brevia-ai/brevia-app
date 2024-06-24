<template>
<div>
    <div class="p-4 sm:p-6 bg-slate-900 text-white shadow-md rounded" v-if="editMode">
        <FormChatbotLink :item="item"
            @close="editMode = false; $emit('close', true)" />
    </div>

    <div v-else>
        <div class="px-4 pt-3.5 pb-4 flex items-start justify-between space-x-4
             text-white"
            :class="(indexed)?'bg-gradient-to-br from-slate-700 to-slate-950':'bg-gradient-to-br from-red-700 to-slate-950'">
            <a class="text-lg leading-snug break-words" target="_blank" :href="item.cmetadata?.url">{{ item.cmetadata?.url }}</a>
            <div class="px-4 flex items-start justify-between space-x-4">
                <button v-if="indexed" class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
                    @click.stop.prevent="$openModal('DialogEditMetadata', {document: item})">
                    <Icon name="ph:code-bold" class="text-xl" />
                </button>

                <button class="text-sky-600 hover:text-sky-400" @click="editMode = true">
                    <Icon name="ph:pencil-simple-bold" class="text-2xl" />
                    <span class="sr-only">{{ $t('EDIT') }}</span>
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
defineProps({
    item: {
        type: Object,
        required: true,
    },
    indexed: Boolean,
});

const editMode = ref(false);
</script>
