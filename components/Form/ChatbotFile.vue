<template>
<div class="grow flex flex-col space-y-1">
    <div class="flex items-center space-x-2">
        <UIXInputFile accept-types="application/pdf"
            label-classes="button-secondary w-full justify-between italic"
            @file-change="upload($event)"
            :is-loading="isLoading" />

        <div class="text-xs text-slate-600" v-if="isLoading">uploading</div>
    </div>

    <p class="text-xs text-center sm:text-left text-slate-600">{{ $t('FILE_TYPE_MUST_BE') }} <span class="font-bold">PDF</span></p>
</div>
</template>

<script lang="ts" setup>
const file = ref(false);
const isLoading = ref(false);

const upload = async (newFile: File) => {
    isLoading.value = true;
    console.log('upload', newFile);
    // const formData = new FormData();
    // formData.append('file', newFile);
    // const { data } = await useFetch('', {
    //     method: 'POST',
    //     body: formData,
    // });

    setTimeout(() => {
        isLoading.value = false;
    }, 5000);
}
</script>
