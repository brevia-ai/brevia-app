<template>
  <div class="flex flex-col space-y-10">
    <!-- new -->

    <div v-if="!addMode" class="flex flex-row justify-between">
      <div>
        <button v-if="isLinkAddAllowed" class="button button-secondary uppercase justify-between items-start px-3.5 text-left" @click="addMode = true">
          <span class="normal-case italic md:text-base text-sm">{{ $t('CLIC_TO_ADD_LINK') }}</span>
          <Icon name="ph:plus-bold" class="text-2xl shrink-0" />
        </button>
        <p v-if="isDemo" class="mt-2 text-xs text-center sm:text-left text-slate-600">
          {{ $t('MAX_NUMBER_LINKS') }}: <span class="font-bold">{{ $config.public.demo.maxChatLinks }}</span>
        </p>
      </div>
    </div>

    <FormChatbotLink v-else @close="closeForm" />

    <div class="flex flex-row gap-4 items-center">
      <span class="self-center">{{ $t('SHOW_FILTERED') }}</span>
      <div class="w-52 h-full px-1 border rounded border-primary bg-white hover:bg-sky-100 focus:outline-primary text-primary hover:cursor-default">
        <div class="flex flex-row justify-between self-center p-1" @click="openSelect = !openSelect">
          <span>{{ $t('LINK_FILTERS.' + filterType) }}</span>
          <Icon class="text-xs self-center" name="ph:caret-down-bold" />
        </div>
        <div v-if="openSelect" class="w-52 -mx-1 max-h-96 absolute z-50 bg-white border border-primary rounded shadow-md overflow-y-scroll">
          <div
            v-for="(f, index) in FILTERS"
            :key="index"
            class="p-1"
            :class="FILTERS[index] == filterType ? 'bg-primary text-white hover:bg-opacity-80' : 'hover:bg-primary hover:text-white'"
            @click="
              filterType = FILTERS[index];
              openSelect = !openSelect;
            "
          >
            {{ $t('LINK_FILTERS.' + f) }}
          </div>
        </div>
      </div>
    </div>
    <!-- existing -->
    <div v-if="isLoading" class="-my-6 ellipsis-loading text-sky-700"><span class="sr-only">loading...</span></div>
    <div v-else-if="filteredLinks().length" class="links space-y-6">
      <div v-for="item in filteredLinks()" id="links" :key="item.custom_id">
        <div class="link">
          <ElementChatbotLinkItem :item="item" :indexed="checkindexed(item.custom_id)" :httperror="checkHttpError(item.custom_id)" @close="closeForm" />
        </div>
      </div>
    </div>
    <p v-else class="mx-auto font-bold">{{ $t('NO_RESULTS_WITH_FILTER') }}</p>
  </div>
</template>

<script lang="ts" setup>
const addMode = ref(false);
const isLoading = ref(true);
const statesStore = useStatesStore();
const collection = statesStore.collection as any;
const FILTERS = ref(['ALL_LINKS', 'INDEXED_LINKS', 'NON_INDEXED_LINKS', 'ERROR_LINKS']);

const isDemo = statesStore.userHasRole('demo');
const isLinkAddAllowed = ref(false);
const links = ref([] as any);
let indexedItems = [] as any;
const integration = useIntegration();
const filterType = ref('ALL_LINKS');
const openSelect = ref(false);

const loadLinks = async () => {
  isLoading.value = true;
  const endpoint = `/api/${integration}/index/${collection?.uuid}/documents_metadata?filter[type]=links&sort=-created`;
  if (integration === 'brevia') {
    const items = await $fetch(endpoint);
    links.value = items;
    indexedItems = items;
  } else {
    const items = await useApiGetAll(endpoint);
    links.value = items.res;
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

const checkHttpError = (id: string | undefined) => {
  const it = indexedItems?.find((element: any) => element.custom_id == id);
  if (!it) {
    return null;
  }
  return it.cmetadata.http_error;
};

const filteredLinks = () => {
  const referenceIds = indexedItems.map((item: any) => item.custom_id);
  switch (filterType.value) {
    case 'INDEXED_LINKS': {
      return links.value.filter((el: any) => referenceIds.includes(el.custom_id));
    }
    case 'NON_INDEXED_LINKS': {
      return links.value.filter((el: any) => !referenceIds.includes(el.custom_id));
    }
    case 'ERROR_LINKS': {
      const errorLinks = new Map(indexedItems.map((item: any) => [item.custom_id, item.cmetadata.http_error]));
      return links.value.filter((el: any) => errorLinks.get(el.custom_id));
    }
    default: {
      return links.value;
    }
  }
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
