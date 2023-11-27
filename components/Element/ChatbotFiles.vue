<template>
<div class="flex flex-col space-y-8">
    <!-- new -->
    <div>
        <FormChatbotFile :collection="collection" @file-uploaded="reloadFiles" v-if="isUploadAllowed" />

        <p class="mt-2 text-xs text-center sm:text-left text-slate-600" v-if="isDemo">
            {{ $t('MAX_NUMBER_FILES') }}: <span class="font-bold">{{ $config.public.demo.maxChatFiles }}</span>
        </p>
    </div>

    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-800"
        v-if="isLoading"><span class="sr-only">loading...</span></div>

    <div class="flex flex-col space-y-2.5" v-else-if="files?.formattedData.data.length">
        <ElementChatbotFileItem
            v-for="item in files.formattedData.data" :key="item.id"
            :item="item"
            @file-deleted="reloadFiles" />
    </div>
</div>
</template>

<script lang="ts" setup>
const props = defineProps({
    collection: {
        type: Object,
        required: true,
    },
});
const isLoading = ref(true);
const isDemo = ref(useStatesStore().userHasRole('demo'));
const isUploadAllowed = ref(true);

function checkUploadAllowed(newFiles: any) {
    if (!useStatesStore().userHasRole('demo')) {
        return true;
    }

    const num = newFiles?.formattedData?.data?.length || 0;
    return parseInt(useRuntimeConfig().public.demo.maxChatFiles) > num;
}

const endpoint = `/api/bedita/collections/${props.collection.cmetadata.id}/has_documents?filter[type]=files&sort=-created`;
const { data: files } = await useApiGetAll(endpoint);
isLoading.value = false;
const reloadFiles = async () => {
    isLoading.value = true;
    await useApiGetAll(endpoint);
    isLoading.value = false;
}

watch(files, (newFiles) => {
    isUploadAllowed.value = checkUploadAllowed(newFiles);
});

</script>
