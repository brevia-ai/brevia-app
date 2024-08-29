<template>
  <div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
      <p class="text-lg">{{ $t('EDIT_METADATA') }}</p>
    </div>

    <template v-if="loaded">
      <div v-if="properties.length == 0" class="flex justify-center">
        <span class="font-semibold">{{ $t('NO_METADATA') }}</span>
      </div>

      <div v-else-if="properties && !docsFound" class="flex justify-center">
        <span class="font-semibold">{{ $t('NO_INDEXED_DOCUMENTS') }}</span>
      </div>

      <div v-else class="flex flex-col space-y-2.5">
        <div v-for="(meta, name) in properties" :key="name" class="mx-12 content-start grid grid-cols-2 gap-2">
          <slot v-if="isSelect(meta)">
            <label class="items-center space-x-2 justify-end py-1" for="item_{{ index}}">{{ name }}</label>
            <select id="item_{{ index}}" v-model="metadata[name]" class="justify-self-start border rounded border-slate-300 p-1" name="item_{{ index}}">
              <option v-for="item in meta.enum" :key="item" :value="item">{{ item }}</option>
            </select>
          </slot>

          <slot v-if="isDate(meta)">
            <label class="flex items-center space-x-2">
              <span>{{ name }}</span>
              <!-- <input type="text" name="item_{{ index}}" id="item_{{ index}}" v-model="metadata[name]"> -->
            </label>
            <VueDatePicker
              v-model="metadata[name]"
              :range="false"
              :enable-time-picker="false"
              text-input
              position="center"
              model-type="yyyy-MM-dd"
              :format="formatDate"
            >
            </VueDatePicker>
          </slot>

          <slot v-if="isCheckbox(meta)">
            <label class="flex flex-row items-center space-x-2">
              <span>{{ name }}</span>
            </label>
            <input id="item_{{ index}}" v-model="metadata[name]" type="checkbox" class="justify-self-start" name="item_{{ index}}" />
          </slot>
          <span class="w-full mt-0 text-xs font-semibold opacity-75">{{ meta?.description }}</span>
        </div>
      </div>

      <div class="flex justify-center space-x-4">
        <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

        <button class="button button-danger uppercase" :disabled="properties.length == 0 || !docsFound" @click="updateMetadata">
          {{ $t('SAVE') }}
        </button>
      </div>
    </template>
    <template v-else>
      <div class="h-28 flex">
        <ElementLoader :loader_dim="64" class="mx-auto" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
const props = defineProps({
  document: {
    type: Object,
    default: () => ({}),
  },
});

const statesStore = useStatesStore() as any;

const metadata = ref<any>({});
const docsFound = ref(false);
const loaded = ref(false);

// documents metadata JSON Schema
const schema = statesStore.collection?.cmetadata?.documents_metadata || {};
const properties = schema?.properties || [];
const error = ref(false);

onBeforeMount(async () => {
  try {
    const response = await fetch(`/api/brevia/index/${statesStore.collection?.uuid}/${props.document.custom_id}`);
    const data = await response.json();
    docsFound.value = (data?.length || 0) > 0;
    metadata.value = data?.[0]?.cmetadata || {};
    setTimeout(() => (loaded.value = true), 250);
  } catch (err) {
    console.log(err);
    setTimeout(() => (loaded.value = true), 250);
  }
});

const { $closeModal } = useNuxtApp();

const isSelect = (prop: any) => {
  return prop?.type == 'string' && prop?.enum;
};

const isDate = (prop: any) => {
  return prop?.type == 'string' && prop?.format == 'date';
};

const isCheckbox = (prop: any) => {
  return prop?.type == 'boolean';
};

const updateMetadata = async () => {
  try {
    await $fetch('/api/brevia/index/metadata', {
      method: 'POST',
      body: {
        collection_id: statesStore.collection?.uuid || '',
        document_id: props.document.custom_id,
        metadata: metadata.value,
      },
    });
    $closeModal();
  } catch (err) {
    console.log(err);
    error.value = true;
  }
};

const formatDate = (date: any) => {
  if (!date) {
    return ``;
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
</script>
