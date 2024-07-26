<template>
<div>
    <div class="p-4 sm:p-6 bg-slate-900 text-white shadow-md rounded" v-if="editMode">
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
                <button v-if="indexed && !httperror" class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
                    @click.stop.prevent="$openModal('DialogEditMetadata', {document: item})">
                    <Icon name="ph:code-bold" class="text-xl" />
                </button>

                <button v-if="indexed && httperror" class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
                    @click.stop.prevent="reindex(item.cmetadata.url, collectionid, item.cmetadata)">
                    <Icon name="ph:arrows-counter-clockwise-bold" class="text-xl" :class="(indexing)?'animate-spin':''"/>
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
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    indexed: Boolean,
    collectionid: String,
    httperror: String,
});
//console.log(props.item)
const integration = useIntegration();
const editMode = ref(false);
const indexing = ref(false)

const reindex = async(url: string, collection: string | undefined, metadata: any) => {
    indexing.value = true;
    try {
        await $fetch(`/api/brevia/index/link`, {
            method: 'POST',
            body: {
                link: url,
                collection_id : collection,
                metadata: metadata,
                options: {},
            },
        });
        indexing.value = false;
    } catch (err) {
        console.log(err);
        indexing.value = false;
    }
}
</script>
