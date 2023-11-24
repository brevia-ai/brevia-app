<template>
<div class="flex flex-col space-y-8">
    <!-- new -->
    <FormChatbotFile :collection="collection" @file-uploaded="refresh" />

    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-800"
        v-if="isLoading"><span class="sr-only">loading...</span></div>

    <div class="flex flex-col space-y-2.5" v-else-if="files.formattedData.data.length">
        <ElementChatbotFileItem
            v-for="item in files.formattedData.data" :key="item.id"
            :item="item"
            @file-deleted="refresh" />
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

const { data: files, r: refresh } = await loadFilesData(1,100);
isLoading.value = false;

async function loadFilesData (pageToLoad: number, chunkSize:number) {
    let pageQuestions = await useFetch(`/api/bedita/collections/${props.collection.cmetadata.id}/has_documents?filter[type]=files&sort=-created&page_size=${chunkSize}&page=${pageToLoad}`);
    let pageData = pageQuestions.data;
    let numPages = pageQuestions.data.value.meta.pagination.page_count;
    if(pageToLoad < numPages){
        let sub = await loadFilesData(pageToLoad + 1, 100);
        pageData.value.formattedData.data = pageData.value.formattedData.data.concat(sub.data.value.formattedData.data);
    }
    return {
        data:pageData,
        r:pageQuestions.refresh
    };
}

</script>
