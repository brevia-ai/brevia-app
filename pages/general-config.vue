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
        <div>
          Text Splitter
          <JsonEditorVue v-model="textSplitter" :mode="Mode.text" />
        </div>
      </div>
    </Transition>

    <!--Q&A AND CHAT-->
    <div class="flex border-b-4 border-primary hover:cursor-pointer" @click="openCloseSection('Q&A and Chat')">
      <p class="mx-auto font-bold uppercase text-xl">Q&A and Chat</p>
      <Icon :name="qacVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" size="32" />
    </div>
    <Transition name="section-fade">
      <div v-if="qacVisible" class="space-y-4">
        <UIXInput v-model.trim="searchDocsNum" label="Documents Number" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />
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

    <!--SUMMARIZE-->
    <div class="flex border-b-4 border-primary hover:cursor-pointer" @click="openCloseSection('Summarize')">
      <p class="mx-auto font-bold uppercase text-xl">Summarize</p>
      <Icon :name="sumVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" size="32" />
    </div>
    <Transition name="section-fade">
      <div v-if="sumVisible" class="space-y-4">
        <div>
          Summarize LLm
          <JsonEditorVue v-model="summarizeLLm" :mode="Mode.text" />
        </div>

        <UIXInput v-model.trim="summarizeChunkSize" label="Summarize Chunk Size" autocapitalize="on" @keydown.enter.stop.prevent="saveConfig" />

        <UIXInput v-model.trim="summarizeChunkOverlap" label="Summarize Chunk Overlap" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />
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
      <button class="button button-primary uppercase" :class="{ 'is-loading': isLoading }" @click="$openModal('ResetConfig', { settings: settings })">
        {{ $t('RESET') }}
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue';
import { Mode } from 'vanilla-jsoneditor';

const { $openModal } = useNuxtApp();

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

const breviaConfig: any = await $fetch('/api/brevia/config');
const breviaConfigSchema: any = await $fetch('/api/brevia/config/schema');

const updatedSettings = ref({});
const resettedSettings = ref([]);

// Index And Search
const idxVisible = ref(true);
const embeddings = ref(breviaConfig.embeddings);
const chunkSize = ref(String(breviaConfig.text_chunk_size));
const chundOverlap = ref(String(breviaConfig.text_chunk_overlap));
const textSplitter = ref(breviaConfig.text_splitter);
// Q&A and Chat
const qacVisible = ref(true);
const qaFollowupLLm = ref(breviaConfig.qa_followup_llm);
const qaCompletionLLM = ref(breviaConfig.qa_completion_llm);
const qaRetriever = ref(breviaConfig.qa_retriever);
const searchDocsNum = ref(String(breviaConfig.search_docs_num));
// Summarize
const sumVisible = ref(true);
const summarizeLLm = ref(breviaConfig.summarize_llm);
const summarizeChunkSize = ref(String(breviaConfig.summ_token_splitter));
const summarizeChunkOverlap = ref(String(breviaConfig.summ_token_overlap));

const saveConfig = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  await update();
  isLoading.value = false;
};

const update = async () => {
  try {
    checkSettings();
    if (Object.keys(updatedSettings.value).length) {
      await $fetch('/api/brevia/config', {
        method: 'POST',
        body: updatedSettings.value,
      });
    }
    if (resettedSettings.value.length) {
      await $fetch('/api/brevia/config/reset', {
        method: 'POST',
        body: resettedSettings.value,
      });
    }
  } catch (err) {
    error.value = true;
    console.error(err);
  }
};

const settings = computed(() => {
  return Object.keys(breviaConfig);
});

const isSettingChanged = (setting: string, value: any) => {
  const defaultValue = breviaConfigSchema.properties?.[setting]?.default || null;

  return JSON.stringify(defaultValue) !== JSON.stringify(value);
};

const checkSettings = () => {
  updatedSettings.value = {};
  resettedSettings.value = [];
  // Index and search
  handleJson('embeddings', embeddings.value);
  handleInt('text_chunk_size', chunkSize.value);
  handleInt('text_chunk_overlap', chundOverlap.value);
  handleJson('text_splitter', textSplitter.value);
  // Q&A and chat
  handleJson('qa_followup_llm', qaFollowupLLm.value);
  handleJson('qa_completion_llm', qaCompletionLLM.value);
  handleJson('qa_retriever', qaRetriever.value);
  handleInt('search_docs_num', searchDocsNum.value);
  // Summarize
  handleJson('summarize_llm', summarizeLLm.value);
  handleInt('summ_token_splitter', summarizeChunkSize.value);
  handleInt('summ_token_overlap', summarizeChunkOverlap.value);
};

const handleInt = (name: string, targetValue: any) => {
  const value = JSON.parse(JSON.stringify(targetValue));
  if (!value || value === '') {
    resettedSettings.value.push(name);

    return;
  }
  if (isSettingChanged(name, parseInt(value))) {
    updatedSettings.value[name] = parseInt(value);
  }
};

const handleJson = (name: string, targetValue: any) => {
  const value = JSON.parse(JSON.stringify(targetValue));
  if (!value || value === '') {
    resettedSettings.value.push(name);

    return;
  }

  try {
    if (isSettingChanged(name, value)) {
      updatedSettings.value[name] = typeof value === 'string' ? value : JSON.stringify(value);
    }
  } catch (err) {
    console.error(err);
  }
};

const openCloseSection = (sectionType: string) => {
  switch (sectionType) {
    case 'IndexAndSearch':
      idxVisible.value = !idxVisible.value;
      break;
    case 'Q&A and Chat':
      qacVisible.value = !qacVisible.value;
      break;
    case 'Summarize':
      sumVisible.value = !sumVisible.value;
      break;
  }
};
</script>
