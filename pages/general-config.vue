<template>
  <form class="flex flex-col space-y-6" @submit.prevent="saveConfig">

    <!--INDEX AND SEARCH-->
    <div class="flex border-b-4 border-primary hover:cursor-pointer" @click="openCloseSection('IndexAndSearch')">
      <p class="mx-auto font-bold uppercase text-xl">Index and Search</p>
      <Icon :name="idxVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" size="32" />
    </div>
    <Transition name="section-fade">
      <div v-if="idxVisible" class="space-y-4">
        <div>
          Embeddings
          <JsonEditorVue v-model="embeddings" :mode="Mode.text" />
        </div>

        <UIXInput v-model.trim="chunkSize" label="Chunk Size" autocapitalize="on" @keydown.enter.stop.prevent="saveConfig" />

        <UIXInput v-model.trim="chundOverlap" label="Chunk Overlap" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />
      </div>
    </Transition>

    <!--Q&A AND CHAT-->
    <div class="flex border-b-4 border-primary hover:cursor-pointer" @click="openCloseSection('Q&A and Chat')">
      <p class="mx-auto font-bold uppercase text-xl">Q&A and Chat</p>
      <Icon :name="qacVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" size="32" />
    </div>
    <Transition name="section-fade">
      <div v-if="qacVisible" class="space-y-4">
        <UIXInput v-model.trim="docsNum" label="Documents Number" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />
        <div>
          Folloup LLm
          <JsonEditorVue v-model="qaFollowupLLm" :mode="Mode.text" />
        </div>

        <div>
          Completion LLm
          <JsonEditorVue v-model="qaCompletionLLM" :mode="Mode.text" />
        </div>

        <div>
          Q&A Retriever
          <JsonEditorVue v-model="qaRetriever" :mode="Mode.text" />
        </div>
      </div>
    </Transition>

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
import { Mode } from 'vanilla-jsoneditor';

definePageMeta({
  middleware: [
    function () {
      const statesStore = useStatesStore();
      const isAdmin = statesStore.userHasRole('admin');
      if (!isAdmin) {
        return navigateTo('/');
      }
    },
  ],
});

const error = ref(false);
const isLoading = ref(false);

const breviaConfig = await $fetch('/api/brevia/config');
console.log(breviaConfig);

//Index And Search
const idxVisible = ref(true);
const embeddings = ref(breviaConfig.embeddings);
const chunkSize = ref(breviaConfig.text_chunk_size);
const chundOverlap = ref(breviaConfig.text_chunk_overlap);
const textSplitter = ref(breviaConfig.text_splitter);
//Q&A and Chat
const qacVisible = ref(true);
const qaFollowupLLm = ref(breviaConfig.qa_followup_llm);
const qaCompletionLLM = ref(breviaConfig.qa_completion_llm);
const qaRetriever = ref(breviaConfig.qa_retriever);
const docsNum = ref(breviaConfig.docs_num);

const saveConfig = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  await update();
  isLoading.value = false;
};

const update = async () => {
  // try {
  //   updateMetadataItems();
  //   await $fetch(`/api/${integration}/collections/${statesStore?.collection?.uuid}`, {
  //     method: 'PATCH',
  //     body: collection,
  //   });

  //   statesStore.collection = collection;
  // } catch (err) {
  //   error.value = true;
  //   console.error(err);
  // }
};

const updateMetadataItems = () => {
  //Update index and search
  handleJsonMeta('embeddings', embeddings.value);
  handleIntMeta('chunk_size', chunkSize.value);
  handleIntMeta('chunk_overlap', chundOverlap.value);
  handleJsonMeta('text_splitter', textSplitter.value);
  //Q&A and chat
  handleJsonMeta('qa_followup_llm', qaFollowupLLm.value);
  handleJsonMeta('qa_completion_llm', qaCompletionLLM.value);
  handleJsonMeta('qa_retriever', qaRetriever.value);
  handleIntMeta('docs_num', docsNum.value);
};

const handleIntMeta = (name: string, value: any) => {
  // if (!value || value === '') {
  //   // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  //   delete collection.cmetadata[name];

  //   return;
  // }
  // collection.cmetadata[name] = parseInt(value);
};

const handleJsonMeta = (name: string, value: any) => {
  // if (!value || value === '') {
  //   // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  //   delete collection.cmetadata[name];

  //   return;
  // }

  // try {
  //   collection.cmetadata[name] = typeof value === 'string' ? JSON.parse(value) : value;
  // } catch (err) {
  //   console.error(err);
  // }
};

const openCloseSection = (sectionType: string) => {
  switch (sectionType) {
    case 'IndexAndSearch':
      idxVisible.value = !idxVisible.value;
      break;
    case 'Q&A and Chat':
      qacVisible.value = !qacVisible.value;
      break;
  }
};
</script>

<style>
/* Entrata */
.section-fade-enter-active {
  transition: opacity 0.5s ease;
}
.section-fade-enter-from {
  opacity: 0;
}
.section-fade-enter-to {
  opacity: 1;
}
/* Uscita */
.section-fade-leave-active {
  transition: opacity 0s ease;
}
.section-fade-leave-from {
  opacity: 1;
}
.section-fade-leave-to {
  opacity: 0;
}
</style>
