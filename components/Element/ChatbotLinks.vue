<template>
<div class="flex flex-col space-y-10">
    <!-- new -->
    <div v-if="!addMode" class="flex flex-row justify-between ">
        <div>
            <button class="button button-secondary uppercase justify-between items-start px-3.5 text-left" @click="addMode = true" v-if="isLinkAddAllowed">
                <span class="normal-case italic">{{  $t('CLIC_TO_ADD_LINK') }}</span>
                <Icon name="ph:plus-bold" class="text-2xl shrink-0" />
            </button>
            <p class="mt-2 text-xs text-center sm:text-left text-slate-600" v-if="isDemo">
                {{ $t('MAX_NUMBER_LINKS') }}: <span class="font-bold">{{ $config.public.demo.maxChatLinks }}</span>
            </p>
        </div>
    </div>

    <FormChatbotLink :collection-id="collection?.cmetadata.id" @close="closeForm" v-else />
    <!-- existing -->
    <div class="-my-6 ellipsis-loading text-sky-700"
        v-if="isLoading"><span class="sr-only">loading...</span></div>
    <div class="links space-y-6" v-else-if="links?.formattedData.data.length">
        <div id="links" v-for="item in links.formattedData.data" :key="item.id">
            <div class="link" >
                <ElementChatbotLinkItem :item="item" :collection-id="collection?.cmetadata.id" @close="closeForm" />
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
const addMode = ref(false);
const isLoading = ref(true);
const statesStore = useStatesStore();
const collection = statesStore.collection;

const isDemo = statesStore.userHasRole('demo');
const isLinkAddAllowed = ref(false);

const endpoint = `/api/bedita/links?filter[document_of]=${collection?.cmetadata?.id}&sort=-created`;
const { data: links } = await useApiGetAll(endpoint);
isLoading.value = false;
isLinkAddAllowed.value = checkAddAllowed(links);

const closeForm = async (e: boolean) => {
    if (e) {
        isLoading.value = true;
        await useApiGetAll(endpoint);
        isLoading.value = false;
    }

    addMode.value = false;
}


watch(links, (newLinks) => {
    isLinkAddAllowed.value = checkAddAllowed(newLinks);
});

function checkAddAllowed(newLinks: any) {
    if (!isDemo) {
        return true;
    }

    const num = newLinks?.value?.data?.length || newLinks?.data?.length || 0;
    return parseInt(useRuntimeConfig().public.demo.maxChatLinks) > num;
}

</script>

<style scoped>
    .links {
        counter-reset: link;
    }
    .link {
        @apply relative;
        &:before {
            content: counter(link);
            counter-increment: link;
            @apply hidden lg:flex absolute -left-9 top-3 w-8 h-8 items-center justify-center text-slate-700 text-lg font-mono font-bold leading-none;
        }
    }
</style>
