<template>
<div class="flex flex-col space-y-8">
    <!-- new -->
    <div>
        <FormChatbotFile @file-uploaded="reloadFiles" v-if="isUploadAllowed" />

        <p class="mt-2 text-xs text-center sm:text-left text-slate-600" v-if="isDemo">
            {{ $t('MAX_NUMBER_FILES') }}: <span class="font-bold">{{ $config.public.demo.maxChatFiles }}</span>
        </p>
    </div>

    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-800"
        v-if="isLoading"><span class="sr-only">loading...</span></div>

    <div class="flex flex-col space-y-2.5" v-else-if="files?.formattedData.data.length">
        <ElementChatbotFileItem
            v-for="item in files.formattedData.data" :key="item.id" :item="item" :indexed="checkIndexed(item.id)"  @file-deleted="reloadFiles" />
    </div>
</div>
</template>

<script lang="ts" setup>
const isLoading = ref(true);
const statesStore = useStatesStore();
const collection = <any>statesStore.collection;

const isDemo = statesStore.userHasRole('demo');
const isUploadAllowed = ref(false);

function checkUploadAllowed(newFiles: any) {
    if (!isDemo) {
        return true;
    }

    const num = newFiles?.value?.data?.length || newFiles?.data?.length || 0;
    return parseInt(useRuntimeConfig().public.demo.maxChatFiles) > num;
}

const endpoint = `/api/bedita/collections/${collection?.cmetadata?.id}/has_documents?filter[type]=files&sort=-created`;
const { data: files } = await useApiGetAll(endpoint);
const indexedItems = await $fetch(`/api/brevia/index/${collection?.uuid}/documents_metadata?filter[type]=files`);
isLoading.value = false;
isUploadAllowed.value = checkUploadAllowed(files);

const reloadFiles = async () => {
    isLoading.value = true;
    await useApiGetAll(endpoint);
    isLoading.value = false;
}

const checkIndexed = (id: string | undefined) => {
    if(indexedItems.filter((element :any) => element.custom_id == id ).length == 0){
        return false;
    }
    return true;
}

watch(files, (newFiles) => {
    isUploadAllowed.value = checkUploadAllowed(newFiles);
});

</script>
