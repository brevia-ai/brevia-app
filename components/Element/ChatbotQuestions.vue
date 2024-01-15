<template>
<div class="flex flex-col space-y-10">
    <!-- new -->
    <div v-if="!addMode">
        <button class="button button-secondary uppercase justify-between items-start px-3.5 text-left" @click="addMode = true" v-if="isQuestionAddAllowed">
            <span class="normal-case italic">{{  $t('CLIC_TO_ADD_QUESTION') }}</span>
            <Icon name="ph:plus-bold" class="text-2xl shrink-0" />
        </button>
        <p class="mt-2 text-xs text-center sm:text-left text-slate-600" v-if="isDemo">
            {{ $t('MAX_NUMBER_QUESTIONS') }}: <span class="font-bold">{{ $config.public.demo.maxChatQuestions }}</span>
        </p>
    </div>

    <FormChatbotQuestion :collection-id="collection.cmetadata.id" @close="closeForm" v-else />

    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-700"
        v-if="isLoading"><span class="sr-only">loading...</span></div>

    <div class="questions space-y-6" v-else-if="questions?.formattedData.data.length">
        <div v-for="item in questions.formattedData.data" :key="item.id">
            <div class="question">
                <ElementChatbotQuestionItem :item="item" :collection-id="collection.cmetadata.id" @close="closeForm" />
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
const statesStore = useStatesStore();
statesStore.collection = props.collection;

const isDemo = statesStore.userHasRole('demo');
const isQuestionAddAllowed = ref(false);

const endpoint = `/api/bedita/collections/${props.collection.cmetadata.id}/has_documents?filter[type]=questions&sort=-created`;
const { data: questions } = await useApiGetAll(endpoint);
isLoading.value = false;
isQuestionAddAllowed.value = checkAddAllowed(questions);

const closeForm = async (e: boolean) => {
    if (e) {
        isLoading.value = true;
        await useApiGetAll(endpoint);
        isLoading.value = false;
    }

    addMode.value = false;
}

watch(questions, (newQuestions) => {
    isQuestionAddAllowed.value = checkAddAllowed(newQuestions);
});

function checkAddAllowed(newQuestions: any) {
    if (!isDemo) {
        return true;
    }

    const num = newQuestions?.value?.data?.length || newQuestions?.data?.length || 0;
    return parseInt(useRuntimeConfig().public.demo.maxChatQuestions) > num;
}
</script>

<style scoped>
    .questions {
        counter-reset: question;
    }
    .question {
        @apply relative;
        &:before {
            content: counter(question);
            counter-increment: question;
            @apply hidden lg:flex absolute -left-9 top-3 w-8 h-8 items-center justify-center text-slate-700 text-lg font-mono font-bold leading-none;
        }
    }
</style>
