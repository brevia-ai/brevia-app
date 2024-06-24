<template>
<div class="grow flex flex-col space-y-1">
    <div class="flex items-center space-x-2">
        <UIXInputFile accept-types="application/pdf" ref="inputFile"
            label-classes="button-secondary w-full justify-between italic"
            @file-change="upload($event)"
            :is-loading="isLoading" />

        <div class="text-xs text-slate-600" v-if="isLoading">uploading</div>
    </div>

    <p class="text-xs text-center sm:text-left text-slate-600">{{ $t('FILE_TYPE_MUST_BE') }} <span class="font-bold">PDF</span></p>
</div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['file-uploaded']);

const inputFile = ref();
const isLoading = ref(false);

const statesStore = useStatesStore();
const collection = statesStore.collection;

const upload = async (newFile: File) => {
    isLoading.value = true;

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

    try {
        await $fetch('/api/brevia/index/upload', {
            method: 'POST',
            body: formData,
        });

        inputFile.value?.reset();
        emit('file-uploaded', true);
    } catch (error) {
        console.log(error);
    }

    isLoading.value = false;
}
</script>
