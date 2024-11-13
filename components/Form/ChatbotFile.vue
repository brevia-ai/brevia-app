<template>
  <div class="grow flex flex-col space-y-1">
    <div class="flex items-center space-x-2">
      <UIXInputFile
        ref="inputFile"
        accept-types="application/pdf"
        label-classes="button-secondary w-full justify-between italic"
        :is-loading="isLoading"
        @file-change="upload($event)"
      />

      <div v-if="isLoading" class="text-xs text-slate-600">uploading</div>
    </div>

    <p class="text-xs text-center sm:text-left text-slate-600">{{ $t('FILE_TYPE_MUST_BE') }} <span class="font-bold">PDF</span></p>

    <div v-if="error" class="bg-neutral-100 text-center font-semibold text-brand_primary">
      {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['file-uploaded']);

const inputFile = ref();
const isLoading = ref(false);
const error = ref(false);

const statesStore = useStatesStore();
const collection = statesStore.collection;

const upload = async (newFile: File) => {
  isLoading.value = true;
  error.value = false;
  const metadata = {
    type: 'files',
    file: newFile?.name,
  };
  const options = collection?.cmetadata?.file_upload_options || null;
  const formData = new FormData();
  formData.append('file', newFile);
  formData.append('metadata', JSON.stringify(metadata));
  if (options) {
    formData.append('options', JSON.stringify(options));
  }
  formData.append('collection_id', collection?.uuid || '');
  const integration = useIntegration();

  try {
    await $fetch(`/api/${integration}/index/upload`, {
      method: 'POST',
      body: formData,
    });

    inputFile.value?.reset();
    emit('file-uploaded', true);
  } catch (error) {
    error.value = true;
    console.error(error);
  }

  isLoading.value = false;
};
</script>
