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

const { data: files, refresh } = await useFetch(`/api/bedita/collections/${props.collection.cmetadata.id}/has_documents?filter[type]=files&sort=-created`);
isLoading.value = false;
</script>
