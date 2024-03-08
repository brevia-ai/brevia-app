<template>
<div class="flex flex-col space-y-10">
    <!-- new -->
    <div v-if="!addMode" class="flex flex-row justify-between ">
        <div>
            <button class="button button-secondary uppercase justify-between items-start px-3.5 text-left" @click="addMode = true" v-if="isQuestionAddAllowed">
                <span class="normal-case italic">{{  $t('CLIC_TO_ADD_QUESTION') }}</span>
                <Icon name="ph:plus-bold" class="text-2xl shrink-0" />
            </button>
            <p class="mt-2 text-xs text-center sm:text-left text-slate-600" v-if="isDemo">
                {{ $t('MAX_NUMBER_QUESTIONS') }}: <span class="font-bold">{{ $config.public.demo.maxChatQuestions }}</span>
            </p>
        </div>
        <div class="flex flex-col relative">
            <div class="relative mb-4 flex flex-row">
                <Icon name="ph:magnifying-glass-bold" class="absolute -left-14 mx-4 my-1 text-4xl"/>
                <input
                    type="string"
                    v-model="searchInput"
                    :placeholder="$t('SEARCH')"
                    class="border focus:ring-0 focus:outline-none  pl-4 pr-8 py-3 rounded w-max border-primary"
                    :class="(searchTerm(searchInput))?'border-2 border-sky-500 focus:border-sky-500':'border focus:border-sky-600'"
                />
                <Icon name="ph:x-bold" class="text-sky-600 hover:text-sky-400 hover:cursor-pointer absolute text-2xl hover: top-3 right-2" @click="searchInput = '';"/>
            </div>
            <div class="absolute right-4 -bottom-1 text-sm font-bold italic text-sky-600" v-if="searchTerm(searchInput)">
                {{ questions?.formattedData.data.filter(showThis).length }} {{ $t('ELEMENTS_FOUND') }}
            </div>
        </div>
    </div>

    <FormChatbotQuestion :collection-id="collection?.cmetadata.id" @close="closeForm" v-else />
    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-700"
        v-if="isLoading"><span class="sr-only">loading...</span></div>
    <div class="questions space-y-6" v-else-if="questions?.formattedData.data.length">
        <div id="questions" v-for="item in questions.formattedData.data" :key="item.id">
            <div class="question" v-if="showThis(item)">
                <ElementChatbotQuestionItem :item="item" :collection-id="collection?.cmetadata.id" :search-term="searchTerm(searchInput)" @close="closeForm" />
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
const MIN_SEARCH_LENGTH = 3;

const addMode = ref(false);
const isLoading = ref(true);
const statesStore = useStatesStore();
const collection = statesStore.collection;

const isDemo = statesStore.userHasRole('demo');
const isQuestionAddAllowed = ref(false);
const searchInput = ref('');

const endpoint = `/api/bedita/collections/${collection?.cmetadata?.id}/has_documents?filter[type]=questions&sort=-created`;
const { data: questions } = await useApiGetAll(endpoint);
isLoading.value = false;
isQuestionAddAllowed.value = checkAddAllowed(questions);

const searchTerm = (input: string) => {
    if(input.trim().length > MIN_SEARCH_LENGTH) return input
    return ''
}

const showThis = (item: any) => {
    let term = searchInput.value.toUpperCase()
    if (searchTerm(term).length <= MIN_SEARCH_LENGTH) {
        return true
    }
    let title = item?.attributes?.title?.toUpperCase()
    let description = item?.attributes?.body.toUpperCase()
    return ( title.includes(searchTerm(term)) ||  description.includes(searchTerm(term)) )
}

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
