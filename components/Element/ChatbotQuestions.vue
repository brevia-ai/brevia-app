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

    <div class="questions space-y-6" v-else-if="questions.formattedData.data.length">
        <div v-for="item in questions.formattedData.data" :key="item.id">
            <div class="question">
                <ElementChatbotQuestionItem :item="item" />
            </div>
        </div>
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

<style scoped>
    .questions {
        counter-reset: section;
    }
    .question {
        @apply relative;
        &:before {
            counter-increment: section;
            content: counter(section);
            @apply hidden lg:flex absolute -left-8 top-6 w-8 h-8 items-center justify-center font-mono font-bold leading-none;
        }
    }
</style>
