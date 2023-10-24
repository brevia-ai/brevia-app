<template>
<div class="flex flex-col space-y-10">
    <!-- new -->
    <button class="button button-secondary uppercase justify-between items-start px-3.5 text-left" @click="addMode = true" v-if="!addMode">
        <span class="normal-case italic">{{  $t('CLIC_TO_ADD_QUESTION') }}</span>
        <Icon name="carbon:add-filled" class="text-2xl shrink-0" />
    </button>
    <FormChatbotQuestion @close="addMode = false" v-else />

    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-700"
        v-if="isLoading"><span class="sr-only">loading...</span></div>

    <div class="space-y-6" v-else-if="questions.formattedData.data.length">
        <ElementChatbotQuestionItem
            v-for="item in questions.formattedData.data" :key="item.id"
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

const { data: questions } = await useFetch(`/api/bedita/collections/${props.collection.cmetadata.id}/has_documents?filter[type]=questions`);
isLoading.value = false;
</script>
