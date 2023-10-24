<template>
<div class="flex flex-col space-y-8">
    <!-- new -->
    <FormChatbotFile @file-change="fileChange($event)" />

    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-800"
        v-if="isLoading"><span class="sr-only">loading...</span></div>

    <div class="flex flex-col space-y-2.5" v-else-if="files.formattedData.data.length">
        <ElementChatbotFileItem
            v-for="item in files.formattedData.data" :key="item.id"
            :item="item" />
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

const addMode = ref(false);
const isLoading = ref(true);

const { data: files } = await useFetch(`/api/bedita/collections/${props.collection.cmetadata.id}/has_documents?filter[type]=files`);
isLoading.value = false;


// methods
const fileChange = (event) => {
    console.log('fileChange', event);
};
</script>
