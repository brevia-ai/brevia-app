<template>
  <form class="flex flex-col space-y-6" @submit.prevent="saveMeta">
    <UIXInput v-model.trim="chunkSize" label="Chunk Size" autocapitalize="on" @keydown.enter.stop.prevent="saveMeta" />
    <UIXInput v-model.trim="chundOverlap" label="Chunk Overlap" autocapitalize="none" @keydown.enter.stop.prevent="saveMeta" />

    <label>
      Folloup LLm
      <JsonEditorVue v-model="qaFollowupLLm" />
    </label>

    <label>
      Completion LLm
      <JsonEditorVue v-model="qaCompletionLLM" />
    </label>

    <div v-if="error" class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary">
      {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div class="flex justify-between space-x-4">
      <button
        type="submit"
        class="button button-primary uppercase"
        :class="{
          'is-loading': isLoading,
        }"
      >
        {{ $t('SAVE') }}
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue';

const statesStore = useStatesStore();
const collection = statesStore.collection;
if (!collection?.cmetadata) {
  throw createError({
    statusCode: 404,
    message: 'not found',
    fatal: true,
  });
}
const error = ref(false);
const isLoading = ref(false);
const chunkSize = ref(String(collection.cmetadata.chunk_size));
const chundOverlap = ref(String(collection.cmetadata.chunk_overlap));
const qaFollowupLLm = ref(collection.cmetadata.qa_followup_llm);
const qaCompletionLLM = ref(collection.cmetadata.qa_completion_llm);

const integration = useIntegration();

const saveMeta = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  await update();
  isLoading.value = false;
};

const update = async () => {
  try {
    updateMetadataItems();
    await $fetch(`/api/${integration}/collections/${statesStore?.collection?.uuid}`, {
      method: 'PATCH',
      body: collection,
    });

    statesStore.collection = collection;
  } catch (err) {
    error.value = true;
    console.error(err);
  }
};

const updateMetadataItems = () => {
  collection.cmetadata.chunk_size = parseInt(chunkSize.value);
  collection.cmetadata.chunk_overlap = parseInt(chundOverlap.value);
  collection.cmetadata.qa_followup_llm = qaFollowupLLm.value ? JSON.parse(qaFollowupLLm.value) : null;
  collection.cmetadata.qa_completion_llm = qaCompletionLLM.value ? JSON.parse(qaCompletionLLM.value) : null;
};
</script>
