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
                <button v-if="indexed" class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
                    title="Re-Index"
                    @click.stop.prevent="reindex(item, collectionid)">
                    <Icon name="ph:arrows-counter-clockwise-bold" class="text-xl" :class="(indexing)?'animate-spin':''"/>
                </button>

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
    <!--  -->
    <Transition>
    <div
        v-if="indexingResult == 'Indexed' || indexingResult == 'Not Indexed'"
        class="px-3 py-1 top-1/4 left-1/4 absolute z-50 w-auto h-8 rounded-md bg-green-200"
        :class="{
            'bg-red-200': indexingResult == 'Not Indexed',
            'bg-green-200': indexingResult == 'Indexed'
        }">
        <p v-if="indexingResult == 'Indexed'" class="text-green-800 flex flex-row items-center">
            <Icon name="ph:check-square-fill" />
            Contenuto indicizzato correttamente!
        </p>
        <p v-if="indexingResult == 'Not Indexed'" class="text-red-800 flex flex-row items-center">
            <Icon name="ph:exclamation-mark-fill" />
            Si è verificato un errore durante l'indicizzazione
        </p>
    </div>
    </Transition>
</div>
</template>

<script lang="ts" setup>
defineProps({
    item: {
        type: Object,
        required: true,
    },
    indexed: Boolean,
    collectionid: String,
    httperror: String,
});
const editMode = ref(false);
const indexing = ref(false);
const indexingResult = ref<"Indexed" | "Not Indexed" | "None">("None")

const reindex = async(item: Record<string, any>, collection: string | undefined) => {
    let url = item.url;
    let metadata = item.cmetadata;
    let document_id = item.custom_id;
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
        //indexing
        let data = await $fetch(`/api/brevia/index/${collection}/${document_id}`);
        console.log(data[0]);
        indexing.value = false;
        if(data[0].cmetadata.http_error){
            indexingResult.value = "Not Indexed";
        }
        else {
            indexingResult.value = "Indexed";
        }
        setTimeout(() => {indexingResult.value = "None"}, 1200);
    } catch (err) {
        console.log(err);
        indexing.value = false;
    }
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
