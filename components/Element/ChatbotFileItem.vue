<template>
<div class="pl-3.5 pr-2.5 py-2.5 flex justify-between items-center space-x-4
    text-white hover:text-sky-400 rounded cursor-pointer"
    :class="{
        'bg-gradient-to-br from-slate-700 to-slate-950':!isPolling && isIndexed,
        'bg-gradient-to-br from-red-700 to-slate-950':!isPolling && ! isIndexed,
        'animate-pulse bg-gradient-to-br from-slate-700 to-slate-950 opacity-75':isPolling,

        }"
    @click.stop="download">

    <div class="flex space-x-3.5 items-center">
        <div>
            <Icon name="ph:file-pdf-light" class="text-4xl" />
        </div>

        <div class="leading-tight space-y-1">
            <p class="font-bold">{{ item.attributes.title }}</p>
            <p class="text-xs text-slate-400" v-if="item.attributes.description">{{ $html2text(item.attributes.description) }}</p>
        </div>
    </div>

    <div class="space-x-1 whitespace-nowrap">
        <button v-if="isIndexed" class="mr-auto button button-secondary button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
            @click.stop.prevent="$openModal('DialogEditMetadata', {document: item})">
            <Icon name="ph:code-bold" class="text-xl" />
        </button>

        <a href="#" class="button-mock border-transparent py-2.5 px-1.5" @click.prevent="download">
            <Icon name="ph:download-simple-bold" class="text-xl" />
            <span class="sr-only">{{ $t('DOWNLOAD') }}</span>
        </a>

        <button class="mr-auto button button-secondary button-transparent text-pink-500 hover:bg-danger hover:border-danger hover:text-white pt-2.5 pb-2 px-3" :class="{ 'is-loading': isDeleting }"
            @click.stop.prevent="deleteFile" v-if="item.id">
            <Icon name="ph:trash-simple-bold" class="text-xl" />
        </button>
    </div>

</div>
</template>

<script lang="ts" setup>

//TIME LIMIT FOR POLLING ITEMS 1 MONTH AGO
const OLDEST_CREATED = new Date(new Date().setDate(new Date().getDate() - 1));
const MAX_POLLING_TIME = 180000 //5 min
const INTERVAL = 10000 //10 sec

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    indexed: Boolean,
});

const emit = defineEmits(['file-deleted']);

const statesStore = useStatesStore();
const collection = <any>statesStore.collection;
const isDeleting = ref(false);
const isPolling = ref(true);
const isIndexed = ref(props.indexed);
let intervalId: any = null;

onMounted(() => {
    console.log(collection);
    console.log(new Date(props.item.meta.created) > OLDEST_CREATED);
    (props.indexed)
    ? isPolling.value = false
    : startPolling();
})

const startPolling = () => {
    //First indexing after 1 second
    setTimeout(() => indexFile(props.item.id), 1000);
    let startTime = new Date().getTime();
    //Continuous indexing for 3 minutes, every 10 seconds
    intervalId = setInterval(() => {
        if(new Date().getTime() - startTime > MAX_POLLING_TIME) {
            clearInterval(intervalId);
            isPolling.value = false;
            return;
        }
        indexFile(props.item.id);
    }, INTERVAL);
}

const indexFile = async(id: String) => {
    try{
        console.log('polling', id);
        let data = await $fetch(`/api/brevia/index/${collection?.uuid}/documents_metadata?filter[type]=files&filter[document_id]=${props.item?.id}`);
        if(data.length > 0) {
            isPolling.value = false;
            isIndexed.value = true;
            clearInterval(intervalId);
            return
        }
    } catch(err) {
        console.error(err)
    }
}

const deleteFile = async () => {
    isDeleting.value = true;
    try {
        await $fetch(`/api/bedita/file/${props.item.id}`, { method: 'DELETE' });
        emit('file-deleted', true);
    } catch (err) {
        console.error(err);
    }
    isDeleting.value = false;
};

const download = async () => {
    try {
        const data = await $fetch(`/api/bedita/files/${props.item.id}`, { method: 'GET' });
        console.log(data);
        const url = data.formattedData?.data?.meta?.media_url;
        if (url)
            window.open(url, '_blank');
    } catch (err) {
        console.error(err);
    }
};
</script>
