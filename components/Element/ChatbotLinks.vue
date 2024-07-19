<template>
  <div class="flex flex-col space-y-10">
    <!-- new -->
    <div v-if="!addMode" class="flex flex-row justify-between">
      <div>
        <button v-if="isLinkAddAllowed" class="button button-secondary uppercase justify-between items-start px-3.5 text-left" @click="addMode = true">
          <span class="normal-case italic">{{ $t('CLIC_TO_ADD_LINK') }}</span>
          <Icon name="ph:plus-bold" class="text-2xl shrink-0" />
        </button>
        <p v-if="isDemo" class="mt-2 text-xs text-center sm:text-left text-slate-600">
          {{ $t('MAX_NUMBER_LINKS') }}: <span class="font-bold">{{ $config.public.demo.maxChatLinks }}</span>
        </p>
      </div>
    </div>

    <FormChatbotLink v-else @close="closeForm" />
    <!-- existing -->
    <div v-if="isLoading" class="-my-6 ellipsis-loading text-sky-700"><span class="sr-only">loading...</span></div>
    <div v-else-if="links.length" class="links space-y-6">
      <div v-for="item in links" id="links" :key="item.custom_id">
        <div class="link">
          <ElementChatbotLinkItem :item="item" :indexed="checkindexed(item.custom_id)" @close="closeForm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const addMode = ref(false);
const isLoading = ref(true);
const statesStore = useStatesStore();
const collection = statesStore.collection as any;

const isDemo = statesStore.userHasRole('demo');
const isLinkAddAllowed = ref(false);
const links = ref([]);
let indexedItems = [];
const integration = useIntegration();

const loadLinks = async () => {
  isLoading.value = true;
  const endpoint = `/api/${integration}/index/${collection?.uuid}/documents_metadata?filter[type]=links&sort=-created`;
  if (integration === 'brevia') {
    const items = await $fetch(endpoint);
    links.value = items;
    indexedItems = items;
  } else {
    const items = await useApiGetAll(endpoint);
    links.value = items.data;
    indexedItems = await $fetch(`/api/brevia/index/${collection?.uuid}/documents_metadata?filter[type]=links`);
  }
  isLoading.value = false;
};

await loadLinks();
isLinkAddAllowed.value = checkAddAllowed(links);

const closeForm = async (e: boolean) => {
  if (e) {
    await loadLinks();
  }

  addMode.value = false;
};

const checkindexed = (id: string | undefined) => {
  if (indexedItems?.filter((element: any) => element.custom_id == id)?.length == 0) {
    return false;
  }
  return true;
};

watch(links, (newLinks) => {
  isLinkAddAllowed.value = checkAddAllowed(newLinks);
});

function checkAddAllowed(newLinks: any) {
  if (!isDemo) {
    return true;
  }

  const num = newLinks?.value?.length || newLinks?.length || 0;
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
