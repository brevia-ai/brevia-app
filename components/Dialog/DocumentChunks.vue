<template>
  <div class="w-full">
    <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
      <h3 class="text-xl font-semibold text-gray-900">{{ $t('CHUNKS_FOUND') }}</h3>
      <Icon class="text-2xl hover:cursor-pointer hover:bg-sky-100" name="ph:x-bold" @click="$closeModal()" />
    </div>
    <div class="mb-4 p-2 w-full whitespace-break-spaces overflow-y-auto max-h-[60vh]">
      <div v-if="documentChunks && documentChunks.length > 0" class="flex flex-col space-y-3">
        <div v-for="(doc, n) in documentChunks" :key="n" class="bg-sky-100 shadow-md p-3 rounded-lg">
          <p class="text-lg font-bold">CHUNK {{ n + 1 }}.</p>
          <p class="pt-2 pb-2">{{ doc.document }}</p>
        </div>
      </div>
      <div v-else class="flex flex-col space-y-3">
        <p class="text-sm font-bold">{{ $t('NO_DOCUMENTS') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  documentId: String,
});
const emit = defineEmits(['enlargeWindow']);

const statesStore = useStatesStore();
const { $closeModal } = useNuxtApp();
const collectionUuid: string = statesStore.collection?.uuid || '';
const documentChunks = ref(<any>[]);

onBeforeMount(async () => {
  try {
    const response = await fetch(`/api/brevia/index/${collectionUuid}/${props.documentId}`);
    const data = await response.json();
    if (data) {
      documentChunks.value = data.sort((a: any, b: any) => a.cmetadata.part - b.cmetadata.part);
    }
  } catch (err) {
    console.log(err);
  }
});

onMounted(() => {
  emit('enlargeWindow');
});
</script>
