<template>
  <div class="w-full">
    <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
      <h3 class="text-xl font-semibold text-gray-900">{{ fileName }} {{ $t('CHUNKS_FOUND', { chunks: documentChunks.length }) }}</h3>
      <Icon class="text-2xl hover:cursor-pointer hover:bg-sky-100" name="ph:x-bold" @click="$closeModal()" />
    </div>
    <div class="mb-4 p-2 w-full whitespace-break-spaces overflow-y-auto max-h-[60vh]" v-if="!loadingChunks">
      <div v-if="documentChunks && documentChunks.length > 0" class="flex flex-col space-y-3">
        <div v-for="(doc, n) in documentChunks" :key="n" class="bg-sky-100 shadow-md p-3 rounded-lg">
          <p class="text-lg font-bold">{{ $t('CHUNK') }} {{ n + 1 }}. - {{ $t('NUM_CHARS', { num: doc.document.length }) }}</p>
          <p class="pt-2 pb-2">{{ doc.document }}</p>
        </div>
      </div>
      <div v-else class="flex flex-col space-y-3">
        <p class="text-sm font-bold">{{ $t('NO_CHUNKS') }}</p>
      </div>
    </div>
    <div class="flex items-center justify-center h-40" v-else>
      <ElementLoader :loader-dim="80" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  documentId: {
    type: String,
    default: () => '',
  },
});
const emit = defineEmits(['enlargeWindow']);

const statesStore = useStatesStore();
const { $closeModal } = useNuxtApp();
const collectionUuid: string = statesStore.collection?.uuid || '';
const documentChunks = ref<any>([]);
const loadingChunks = ref(true);
const fileName = ref('');

onBeforeMount(async () => {
  try {
    const response = await fetch(`/api/brevia/index/${collectionUuid}/${props.documentId}`);
    const data = await response.json();
    if (data) {
      documentChunks.value = data.sort((a: any, b: any) => a.cmetadata.part - b.cmetadata.part);
      const type = data?.[0]?.cmetadata?.type || '';
      if (type === 'files') {
        fileName.value = data?.[0]?.cmetadata?.file || '';
      } else if (type === 'links') {
        fileName.value = data?.[0]?.cmetadata?.url || '';
      }
    }
    setTimeout(() => (loadingChunks.value = false), 250);
  } catch (err) {
    console.log(err);
    setTimeout(() => (loadingChunks.value = false), 250);
  }
});

onMounted(() => {
  emit('enlargeWindow');
});
</script>
