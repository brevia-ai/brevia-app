<template>
  <div
    class="pl-3.5 pr-2.5 py-2.5 flex justify-between items-center space-x-4 text-white hover:text-sky-400 rounded cursor-pointer"
    :class="{
      'bg-gradient-to-br from-slate-700 to-slate-950': !isPolling && isIndexed,
      'bg-gradient-to-br from-red-700 to-slate-950': !isPolling && !isIndexed,
      'animate-pulse bg-gradient-to-br from-slate-700 to-slate-950 opacity-75': isPolling,
    }"
    @click.stop="download"
  >
    <div class="flex space-x-3.5 items-center">
      <div>
        <Icon name="ph:file-pdf-light" class="text-4xl" />
      </div>

      <div class="leading-tight space-y-1">
        <p class="font-bold">{{ item.cmetadata?.file }}</p>
        <p v-if="description" class="text-xs text-slate-400">{{ $html2text(description) }}</p>
      </div>
    </div>

    <div class="px-4 flex items-center justify-between space-x-4">
      <button
        v-if="isIndexed"
        class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
        @click.stop.prevent="$openModal('SeeDocumentChunks', { documentId: item.custom_id })"
      >
        <Icon name="ph:code-block-bold" class="text-xl" />
      </button>

      <button
        v-if="isIndexed"
        class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
        @click.stop.prevent="$openModal('DialogEditMetadata', { document: item })"
      >
        <Icon name="ph:code-bold" class="text-xl" />
      </button>

      <a href="#" class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500" @click.prevent="download">
        <Icon name="ph:download-simple-bold" class="text-xl" />
        <span class="sr-only">{{ $t('DOWNLOAD') }}</span>
      </a>

      <button
        v-if="item.custom_id"
        class="button-transparent text-pink-500 hover:bg-danger hover:border-danger hover:rounded-md hover:text-white p-2.5"
        :class="{ 'is-loading': isDeleting }"
        @click.stop.prevent="deleteFile"
      >
        <Icon name="ph:trash-simple-bold" class="text-xl" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
//TIME LIMIT FOR POLLING ITEMS 1 DAY AGO
const OLDEST_CREATED = new Date(new Date().setDate(new Date().getDate() - 1));
const MAX_POLLING_TIME = 180000; //5 min
const INTERVAL = 10000; //10 sec

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  indexed: Boolean,
});

const emit = defineEmits(['file-deleted']);

const statesStore = useStatesStore();
const collection = statesStore.collection as any;
const isDeleting = ref(false);
const isPolling = ref(true);
const isIndexed = ref(props.indexed);
let intervalId: any = null;
const integration = useIntegration();

onMounted(() => {
  const created = new Date(extractField(props.item, 'created'));
  if (!props.indexed && created > OLDEST_CREATED) {
    startPolling();
  } else {
    isPolling.value = false;
  }
});

onBeforeUnmount(() => {
  //Stopping polling when leaving files section
  clearInterval(intervalId);
});

const startPolling = () => {
  //First indexing after 1 second
  setTimeout(() => checkFileIndex(), 1000);
  const startTime = new Date().getTime();
  //Continuous indexing for 3 minutes, every 10 seconds
  intervalId = setInterval(() => {
    if (new Date().getTime() - startTime > MAX_POLLING_TIME) {
      clearInterval(intervalId);
      isPolling.value = false;
      return;
    }
    checkFileIndex();
  }, INTERVAL);
};

const checkFileIndex = async () => {
  try {
    const data = await $fetch(`/api/brevia/index/${collection?.uuid}/documents_metadata?document_id=${props.item?.custom_id}`);
    if (data.length > 0) {
      isPolling.value = false;
      isIndexed.value = true;
      clearInterval(intervalId);
      return;
    }
  } catch (err) {
    console.error(err);
  }
};

const deleteFile = async () => {
  isDeleting.value = true;
  try {
    const statesStore = useStatesStore();
    await $fetch(`/api/${integration}/index/${statesStore?.collection?.uuid}/${props.item.custom_id}`, { method: 'DELETE' });
    emit('file-deleted', true);
  } catch (err) {
    console.error(err);
  }
  isDeleting.value = false;
};

const download = async () => {
  try {
    const url = props.item.cmetadata?.url || null;
    if (url) window.open(url, '_blank');
  } catch (err) {
    console.error(err);
  }
};

const description = computed(() => {
  return extractField(props.item, 'description');
});
</script>
