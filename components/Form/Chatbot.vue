<template>
  <form class="flex flex-col space-y-6" @submit.prevent="save">
    <UIXInput
      v-model.trim="title"
      :label="$t('TITLE')"
      :placeholder="$t('TITLE_PLACEHOLDER')"
      autocapitalize="on"
      autofocus
      required
      @keydown.enter.stop.prevent="save"
    />

    <textarea class="textarea" v-model="description" :placeholder="$t('DESCRIPTION_PLACEHOLDER')" rows="4"></textarea>

    <div v-if="error" class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary">
      {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div :class="{ 'flex justify-between space-x-4': collection?.name }">
      <NuxtLink v-if="collection?.name" class="button button-secondary uppercase" :disabled="!title" :to="collection.name">{{ $t('EXIT') }}</NuxtLink>

      <button
        type="submit"
        class="button button-primary uppercase"
        :class="{
          'w-full max-w-lg mx-auto': !collection?.name,
          'is-loading': isLoading,
        }"
        :disabled="!title"
      >
        <template v-if="collection?.name">{{ $t('SAVE') }}</template>
        <template v-else>{{ $t('CREATE') }}</template>
        chatbot
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
});

const { $closeModal, $html2text } = useNuxtApp();
const statesStore = useStatesStore();
let collection = statesStore.collection;

const error = ref(false);
const isLoading = ref(false);
const title = ref('');
const description = ref('');
const integration = useIntegration();

if (collection) {
  title.value = collection.cmetadata?.title || '';
  description.value = $html2text(collection.cmetadata?.description);
}

const emit = defineEmits(['saveTitle', 'saveDescription']);

// methods
const save = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  if (collection) {
    await update();
    emit('saveTitle', title.value);
    emit('saveDescription', description.value);
  } else {
    await create();
  }
  isLoading.value = false;

  if (props.isModal) $closeModal();
};

const create = async () => {
  try {
    const data = await $fetch(`/api/${integration}/collections`, {
      method: 'POST',
      body: {
        cmetadata: {
          title: title.value,
          description: description.value,
        },
      },
    });

    collection = data;
    statesStore.collection = collection;

    statesStore.menu.push({
      link: `/chatbot/${collection?.name}`,
      type: 'chatbot',
      title: title.value,
      description: description.value,
      params: null,
      edit: ItemEditLevel.ReadWrite,
    });
  } catch (err) {
    error.value = true;
  }
};

const update = async () => {
  try {
    collection.cmetadata = {
      ...collection.cmetadata,
      ...{ title: title.value, description: description.value },
    };

    await $fetch(`/api/${integration}/collections/${statesStore?.collection?.uuid}`, {
      method: 'PATCH',
      body: collection,
    });

    statesStore.collection = collection;
    // update menu
    const newMenu = statesStore.menu.map((item: any) => {
      if (item.type === 'chatbot' && item.link === `/chatbot/${collection?.name}`) {
        item.title = title.value;
        item.description = description.value;
      }

      return item;
    });

    statesStore.menu = newMenu;
  } catch (err) {
    error.value = true;
  }
};
</script>
