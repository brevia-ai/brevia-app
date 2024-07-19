<template>
  <div class="flex flex-col space-y-8">
    <!-- new -->
    <div>
      <FormChatbotFile v-if="isUploadAllowed" @file-uploaded="loadFiles" />

      <p v-if="isDemo" class="mt-2 text-xs text-center sm:text-left text-slate-600">
        {{ $t('MAX_NUMBER_FILES') }}: <span class="font-bold">{{ $config.public.demo.maxChatFiles }}</span>
      </p>
    </div>

    <!-- existing -->
    <div v-if="isLoading" class="-my-6 ellipsis-loading text-sky-800"><span class="sr-only">loading...</span></div>

    <div v-else-if="files.length" class="flex flex-col space-y-2.5">
      <ElementChatbotFileItem v-for="item in files" :key="item.custom_id" :item="item" :indexed="checkIndexed(item.custom_id)" @file-deleted="loadFiles" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const isLoading = ref(true);
const statesStore = useStatesStore();
const collection = statesStore.collection as any;

const isDemo = statesStore.userHasRole('demo');
const isUploadAllowed = ref(false);

const checkUploadAllowed = (newFiles: any) => {
  if (!isDemo) {
    return true;
  }

  const num = newFiles?.value?.length || newFiles?.length || 0;
  return parseInt(useRuntimeConfig().public.demo.maxChatFiles) > num;
};

const files = ref([]);
let indexedItems: any = [];
const integration = useIntegration();

const loadFiles = async () => {
  isLoading.value = true;
  const endpoint = `/api/${integration}/index/${collection?.uuid}/documents_metadata?filter[type]=files&sort=-created`;
  if (integration === 'brevia') {
    const items = await $fetch(endpoint);
    files.value = items;
    indexedItems = items;
  } else {
    const items = await useApiGetAll(endpoint);
    files.value = items.data;
    indexedItems = await $fetch(`/api/brevia/index/${collection?.uuid}/documents_metadata?filter[type]=files`);
  }
  isLoading.value = false;
};

await loadFiles();
isLoading.value = false;
isUploadAllowed.value = checkUploadAllowed(files);

const checkIndexed = (id: string | undefined) => {
  if (indexedItems.filter((element: any) => element.custom_id == id).length == 0) {
    return false;
  }
  return true;
};

watch(files, (newFiles) => {
  isUploadAllowed.value = checkUploadAllowed(newFiles);
});
</script>
