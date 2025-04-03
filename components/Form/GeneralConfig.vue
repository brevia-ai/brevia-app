<template>
  <div v-if="quickLoad" class="fixed flex items-center inset-0 z-50 h-full w-full bg-slate-500 opacity-45">
    <ElementLoader class="mx-auto z-[60]" :loader-dim="95" />
  </div>

  <div class="mb-4">
    <p class="text-sm text-gray-500">
      {{ $t('GENERAL_CONFIG_DESCRIPTION') }}
    </p>
  </div>

  <form class="flex flex-col space-y-12" @submit.prevent="saveConfig">
    <!-- INDEX AND SEARCH -->
    <div class="flex border-b-4 border-primary hover:cursor-pointer" @click="openCloseSection('IndexAndSearch')">
      <p class="mx-auto font-bold uppercase text-xl">Index and Search</p>
      <Icon :name="idxVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" size="32" />
    </div>

    <Transition name="section-fade">
      <div v-if="idxVisible" class="space-y-6">
        <div class="space-y-1.5">
          <h3 class="uppercase tracking-wide">Embeddings</h3>
          <JsonEditorVue v-model="embeddings" :mode="Mode.text" />
        </div>

        <UIXInput v-model.trim="chunkSize" label="Chunk Size" autocapitalize="on" @keydown.enter.stop.prevent="saveConfig" />

        <UIXInput v-model.trim="chunkOverlap" label="Chunk Overlap" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />

        <div class="space-y-1.5">
          <h3 class="uppercase tracking-wide">Text Splitter</h3>
          <JsonEditorVue v-model="textSplitter" :mode="Mode.text" />
        </div>
      </div>
    </Transition>

    <!-- Q&A AND CHAT -->
    <div class="flex border-b-4 border-primary hover:cursor-pointer" @click="openCloseSection('Q&A and Chat')">
      <p class="mx-auto font-bold uppercase text-xl">Q&A and Chat</p>
      <Icon :name="qacVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" size="32" />
    </div>

    <Transition name="section-fade">
      <div v-if="qacVisible" class="space-y-8">
        <UIXInput v-model.trim="searchDocsNum" label="Documents Number" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />

        <ConfigLlm v-model="qaFollowupLLm" title="Followup LLM" />

        <UIXInput v-model.trim="qaFollowupSimThreshold" label="Follow Up Sim Threshold" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />

        <ConfigLlm v-model="qaCompletionLLM" title="Completion LLm" />

        <div class="space-y-1.5">
          <h3 class="uppercase tracking-wide">Q&A Retriever</h3>
          <JsonEditorVue v-model="qaRetriever" :mode="Mode.text" />
        </div>
      </div>
    </Transition>

    <!-- SUMMARIZE -->
    <div class="flex border-b-4 border-primary hover:cursor-pointer" @click="openCloseSection('Summarize')">
      <p class="mx-auto font-bold uppercase text-xl">Summarize</p>
      <Icon :name="sumVisible ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" size="32" />
    </div>

    <Transition name="section-fade">
      <div v-if="sumVisible" class="space-y-6">
        <ConfigLlm v-model="summarizeLLm" title="Summarize LLm" />

        <UIXInput v-model.trim="summarizeChunkSize" label="Summarize Chunk Size" autocapitalize="on" @keydown.enter.stop.prevent="saveConfig" />

        <UIXInput v-model.trim="summarizeChunkOverlap" label="Summarize Chunk Overlap" autocapitalize="none" @keydown.enter.stop.prevent="saveConfig" />
      </div>
    </Transition>

    <div v-if="error" class="p-3 bg-neutral-100 text-center text-brand_primary">
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

      <button class="button button-primary uppercase" :class="{ 'is-loading': isLoading }" @click="handleReset">
        {{ $t('RESET') }}
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue';
import { Mode } from 'vanilla-jsoneditor';

const modal = useModalStore();

const error = ref(false);
const isLoading = ref(false);
const quickLoad = ref(false);

const breviaConfig: any = await $fetch('/api/brevia/config');
const breviaConfigSchema: any = await $fetch('/api/brevia/config/schema');

const updatedSettings = ref<any>({});
const resettedSettings = ref<any>([]);

// Index And Search
const idxVisible = ref(true);
const embeddings = ref(breviaConfig.embeddings);
const chunkSize = ref(String(breviaConfig.text_chunk_size));
const chunkOverlap = ref(String(breviaConfig.text_chunk_overlap));
const textSplitter = ref(breviaConfig.text_splitter);
// Q&A and Chat
const qacVisible = ref(true);
const qaFollowupLLm = ref(breviaConfig.qa_followup_llm);
const qaFollowupSimThreshold = ref(String(breviaConfig.qa_followup_sim_threshold));
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
    quickLoad.value = true;
    refreshValues();
  } catch (err) {
    error.value = true;
    console.error(err);
  }
};

const handleReset = () => {
  modal.openModal('ResetConfig', { settings: settings });
  modal.$onAction(({ after, onError }) => {
    after((result) => {
      if (result === 'refresh') {
        quickLoad.value = true;
        refreshValues();
      }
    });
    onError((error) => {
      console.log(error);
    });
  }, false);
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
  handleInt('text_chunk_overlap', chunkOverlap.value);
  handleJson('text_splitter', textSplitter.value);
  // Q&A and chat
  handleJson('qa_followup_llm', qaFollowupLLm.value);
  handleJson('qa_completion_llm', qaCompletionLLM.value);
  handleJson('qa_retriever', qaRetriever.value);
  handleInt('search_docs_num', searchDocsNum.value);
  handleFloat('qa_followup_sim_threshold', qaFollowupSimThreshold.value);
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

const handleFloat = (name: string, targetValue: any) => {
  const value = JSON.parse(JSON.stringify(targetValue));
  if (!value || value === '') {
    resettedSettings.value.push(name);

    return;
  }
  if (isSettingChanged(name, parseFloat(value))) {
    updatedSettings.value[name] = parseFloat(value);
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

const refreshValues = async () => {
  const updatedConfig = await $fetch('/api/brevia/config');
  // Index And Search
  embeddings.value = updatedConfig.embeddings;
  chunkSize.value = String(updatedConfig.text_chunk_size);
  chunkOverlap.value = String(updatedConfig.text_chunk_overlap);
  textSplitter.value = updatedConfig.text_splitter;
  // Q&A and Chat
  qaFollowupLLm.value = updatedConfig.qa_followup_llm;
  qaCompletionLLM.value = updatedConfig.qa_completion_llm;
  qaRetriever.value = updatedConfig.qa_retriever;
  qaFollowupSimThreshold.value = String(updatedConfig.qa_followup_sim_threshold);
  searchDocsNum.value = String(updatedConfig.search_docs_num);
  // Summarize
  summarizeLLm.value = updatedConfig.summarize_llm;
  summarizeChunkSize.value = String(updatedConfig.summ_token_splitter);
  summarizeChunkOverlap.value = String(updatedConfig.summ_token_overlap);
  setTimeout(() => (quickLoad.value = false), 500);
};
</script>
