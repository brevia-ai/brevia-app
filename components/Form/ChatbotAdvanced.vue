<template>
  <form class="flex flex-col space-y-6" @submit.prevent="saveMeta">
    <!--PROMPTS-->
    <div class="flex border-b-4 border-primary">
      <p class="mx-auto font-bold uppercase text-xl">Prompts</p>
      <Icon
        class="hover:cursor-pointer"
        :name="promptVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'"
        size="32"
        @click="openCloseSection('Prompts')"
      />
    </div>
    <Transition name="section-fade">
      <div v-if="promptVisible" class="space-y-4">
        <div>
          Prompts
          <JsonEditorVue v-model="prompts" :mode="Mode.text" />
        </div>

        <UIXInput v-model.trim="lang" label="Chat Language" autocapitalize="on" @keydown.enter.stop.prevent="saveMeta" />
      </div>
    </Transition>

    <!--INDEX AND SEARCH-->
    <div class="flex border-b-4 border-primary">
      <p class="mx-auto font-bold uppercase text-xl">Index and Search</p>
      <Icon
        class="hover:cursor-pointer"
        :name="idxVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'"
        size="32"
        @click="openCloseSection('IndexAndSearch')"
      />
    </div>
    <Transition name="section-fade">
      <div v-if="idxVisible" class="space-y-4">
        <div>
          Embeddings
          <JsonEditorVue v-model="embeddings" :mode="Mode.text" />
        </div>

        <UIXInput v-model.trim="chunkSize" label="Chunk Size" autocapitalize="on" @keydown.enter.stop.prevent="saveMeta" />

        <UIXInput v-model.trim="chundOverlap" label="Chunk Overlap" autocapitalize="none" @keydown.enter.stop.prevent="saveMeta" />

        <div>
          Text Splitter
          <JsonEditorVue v-model="textSplitter" :mode="Mode.text" />
        </div>
      </div>
    </Transition>

    <!--Q&A AND CHAT-->
    <div class="flex border-b-4 border-primary">
      <p class="mx-auto font-bold uppercase text-xl">Q&A and Chat</p>
      <Icon
        class="hover:cursor-pointer"
        :name="qacVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'"
        size="32"
        @click="openCloseSection('Q&A and Chat')"
      />
    </div>
    <Transition name="section-fade">
      <div v-if="qacVisible" class="space-y-4">
        <UIXInput v-model.trim="docsNum" label="Documents Number" autocapitalize="none" @keydown.enter.stop.prevent="saveMeta" />

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

    <!--DOCUMENTS-->
    <div class="flex border-b-4 border-primary">
      <p class="mx-auto font-bold uppercase text-xl">Documents</p>
      <Icon
        class="hover:cursor-pointer"
        :name="docVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'"
        size="32"
        @click="openCloseSection('Documents')"
      />
    </div>
    <Transition name="section-fade">
      <div v-if="docVisible" class="space-y-4">
        <UIXInput v-model.trim="docsNum" label="Documents Number" autocapitalize="none" @keydown.enter.stop.prevent="saveMeta" />
        <div>
          Documents Metadata
          <JsonEditorVue v-model="docMetadata" :mode="Mode.text" />
        </div>

        <div>
          Metadata Defaults
          <JsonEditorVue v-model="docDefaults" :mode="Mode.text" />
        </div>

        <div>
          File Upload Options
          <JsonEditorVue v-model="upldOptions" :mode="Mode.text" />
        </div>

        <div>
          Link Load Options
          <JsonEditorVue v-model="lnkLdOptions" :mode="Mode.text" />
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
//Propmpts
const promptVisible = ref(true);
const prompts = ref(collection.cmetadata.prompts);
const lang = ref(collection.cmetadata.chat_lang);
//Index And Search
const idxVisible = ref(true);
const embeddings = ref(collection.cmetadata.embeddings);
const chunkSize = ref(String(collection.cmetadata.chunk_size));
const chundOverlap = ref(String(collection.cmetadata.chunk_overlap));
const textSplitter = ref(collection.cmetadata.text_splitter);
//Q&A and Chat
const qacVisible = ref(true);
const qaFollowupLLm = ref(collection.cmetadata.qa_followup_llm);
const qaCompletionLLM = ref(collection.cmetadata.qa_completion_llm);
const qaRetriever = ref(collection.cmetadata.qa_retriever);
const docsNum = ref(String(collection.cmetadata.docs_num));
//Documents
const docVisible = ref(true);
const docMetadata = ref(collection.cmetadata.documents_metadata);
const docDefaults = ref(collection.cmetadata.metadata_defaults);
const upldOptions = ref(collection.cmetadata.file_upload_options);
const lnkLdOptions = ref(collection.cmetadata.link_load_options);

const integration = useIntegration();

console.log(collection.cmetadata);

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
  //Update prompts
  collection.cmetadata.chat_lang = lang.value;
  collection.cmetadata.prompts = prompts.value ? JSON.parse(prompts.value) : null;
  //Update index and search
  collection.cmetadata.embeddings = embeddings.value ? JSON.parse(embeddings.value) : null;
  collection.cmetadata.chunk_size = parseInt(chunkSize.value);
  collection.cmetadata.chunk_overlap = parseInt(chundOverlap.value);
  collection.cmetadata.text_splitter = textSplitter.value ? JSON.parse(textSplitter.value) : null;
  //Q&A and chat
  collection.cmetadata.qa_followup_llm = qaFollowupLLm.value ? JSON.parse(qaFollowupLLm.value) : null;
  collection.cmetadata.qa_completion_llm = qaCompletionLLM.value ? JSON.parse(qaCompletionLLM.value) : null;
  collection.cmetadata.qa_retriever = qaRetriever.value ? JSON.parse(qaRetriever.value) : null;
  collection.cmetadata.docs_num = parseInt(docsNum.value);
  //Documents
  collection.cmetadata.documents_metadata = docMetadata.value ? JSON.parse(docMetadata.value) : null;
  collection.cmetadata.metadata_defaults = docDefaults.value ? JSON.parse(docDefaults.value) : null;
  collection.cmetadata.file_upload_options = upldOptions.value ? JSON.parse(upldOptions.value) : null;
  collection.cmetadata.link_load_options = lnkLdOptions.value ? JSON.parse(lnkLdOptions.value) : null;
};

const openCloseSection = (sectionType: string) => {
  switch (sectionType) {
    case 'Prompts':
      promptVisible.value = !promptVisible.value;
      break;
    case 'IndexAndSearch':
      idxVisible.value = !idxVisible.value;
      break;
    case 'Q&A and Chat':
      qacVisible.value = !qacVisible.value;
      break;
    case 'Documents':
      docVisible.value = !docVisible.value;
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
