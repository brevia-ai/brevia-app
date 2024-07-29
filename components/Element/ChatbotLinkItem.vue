<template>
<div>
    <div class="p-4 sm:p-6 text-white shadow-md rounded"
        :class="{
            'bg-slate-900': (indexed && !httperror),
            'bg-orange-900': (indexed && httperror),
            'bg-red-900': (!indexed),
        }"
        v-if="editMode">
        <FormChatbotLink :item="item"
            @close="editMode = false; $emit('close', true)" />
    </div>

    <div v-else>
        <div class="px-4 pt-3.5 pb-4 flex items-start justify-between space-x-4
             text-white"
            :class="{
                'bg-gradient-to-br from-slate-700 to-slate-950': (indexed && !httperror),
                'bg-gradient-to-br from-orange-700 to-slate-950': (indexed && httperror),
                'bg-gradient-to-br from-red-700 to-slate-950': (!indexed),
            }">
            <div>
                <a class="text-lg leading-snug break-words" target="_blank" :href="item.cmetadata?.url">{{ item.cmetadata?.url }}</a>
                <p v-if="httperror" class="text-xs italic">Errore nella lettura del contenuto - codice errore {{httperror}}</p>
            </div>
            <div class="px-4 flex items-start justify-between space-x-4">
                <button v-if="indexed" class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
                    title="Metadata"
                    @click.stop.prevent="$openModal('DialogEditMetadata', {document: item})">
                    <Icon name="ph:code-bold" class="text-xl" />
                </button>

                <button class="text-sky-600 hover:text-sky-400" @click="editMode = true" title="Edit Link">
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
    httperror: String,
});
const editMode = ref(false);

</script>
