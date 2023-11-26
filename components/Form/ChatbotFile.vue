<template>
<div class="grow flex flex-col space-y-1">
    <div class="flex items-center space-x-2">
        <UIXInputFile accept-types="application/pdf" ref="inputFile"
            label-classes="button-secondary w-full justify-between italic"
            @file-change="upload($event)"
            :is-loading="isLoading" />

        <div class="text-xs text-slate-600" v-if="isLoading">uploading</div>
    </div>
    <div class="space-y-4" v-if="isDemo">
        <p class="block p-8 border text-white rounded-lg text-lg whitespace-pre-line">
            {{ $t('MAX_NUMBER_FILES') }}: {{ $config.public.demo.maxChatFiles }}
        </p>
    </div>
    <div class="space-y-4" v-if="error">
        <p class="block p-8 bg-red-900 border border-red-900 text-white rounded-lg text-lg whitespace-pre-line">{{ error }}</p>
    </div>


    <p class="text-xs text-center sm:text-left text-slate-600">{{ $t('FILE_TYPE_MUST_BE') }} <span class="font-bold">PDF</span></p>
</div>
</template>

<script lang="ts" setup>
const props = defineProps({
    collection: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['file-uploaded']);
const { $fileName2title } = useNuxtApp();

const inputFile = ref();
const isLoading = ref(false);
const isDemo = ref(useStatesStore().userHasRole('demo')); // flag to check for `demo` limits
const error = ref('');

const isFileSizeAccepted = (file: File) => {
    if (!isDemo.value) {
        return true;
    }
    const fileSizeMB = (file?.size || 0)  / (1024 ** 2);

    return parseFloat(useRuntimeConfig().public.demo.maxFileSize) >= fileSizeMB;
}

const upload = async (newFile: File) => {
    if (!isFileSizeAccepted(newFile)) {
        error.value = 'File too big';
        return;
    }
    error.value = '';
    isLoading.value = true;

    const formData = new FormData();
    formData.append('title', $fileName2title(newFile?.name));
    formData.append('file', newFile);
    formData.append('relatedId', props.collection.cmetadata.id);
    formData.append('relatedType', 'collections');
    formData.append('relationName', 'has_documents');

    try {
        await $fetch('/api/bedita/upload/files', {
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
