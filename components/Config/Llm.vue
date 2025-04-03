<template>
  <fieldset class="relative space-y-1.5 border border-solid border-gray-300 p-5 rounded">
    <legend class="text-sm font-semibold uppercase tracking-wide" v-text="title" />

    <template v-if="!editorEnabled">
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UIXSelect v-model="llmConf.model_provider" label="Provider" :options="availableProviders()" :placeholder="$t('SELECT_PROVIDER')" :required="true" />

          <UIXSelect v-model="llmConf.model" label="Model" :options="availableModels" :placeholder="$t('SELECT_MODEL')" :required="true" />

          <UIXInputRange v-model="llmConf.temperature" label="Temperature" :min="0" :max="1" :step="0.1" />
          <UIXInputNumber v-model="llmConf.max_tokens" label="Max tokens" hint="max 16280" :step="100" />
        </div>
      </div>
    </template>

    <button class="absolute -top-7 right-2 sm:-right-3 !py-1.5 button button-xs uppercase" :class="isJsonValid ? 'button-secondary' : 'button-danger'" @click.prevent="switchConfigEditor()">
      <Icon :name="editorEnabled ? 'ph:arrow-fat-line-left-bold' : 'ph:arrow-elbow-down-right-bold'" class="w-4 h-4" />
      <span v-text="editorEnabled ? 'Standard' : 'Advanced'"></span>
    </button>

    <template v-if="editorEnabled">
      <JsonEditorVue v-model="json" :mode="Mode.text" />
    </template>
  </fieldset>
</template>

<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue';
import { Mode } from 'vanilla-jsoneditor';
import type { Provider } from '../../store/providers';

type LlmConfig = {
  model_provider: string;
  model: string;
  temperature?: number | null;
  max_tokens?: number | null;
};

defineProps<{
  title: string;
}>();

const store = useProvidersStore();
const modal = useModalStore();

const json = defineModel<object | string | null>();
const editorEnabled = ref(false);

const availableProviders = () => {
  return store.providers.map((provider: Provider) => ({
    label: provider.model_provider,
    value: provider.model_provider,
  }));
};

const availableModels = computed(() => {
  const models = store.providers.find((p) => p.model_provider === llmConf.model_provider)?.models?.map((m) => m.name) || [];
  return models.sort();
});

const llmConfigFromJson = (jsonVal: any): LlmConfig => {
  try {
    const data = typeof jsonVal === 'string' ? JSON.parse(jsonVal) : jsonVal;

    return {
      model_provider: data?.model_provider || '',
      model: data?.model || data?.model_name || '',
      temperature: data?.temperature ?? 0.0,
      max_tokens: data?.max_tokens ?? null,
    } as LlmConfig;
  } catch (e) {
    console.error('Invalid JSON', e);
    return {
      model_provider: '',
      model: '',
      temperature: 0.0,
      max_tokens: null,
    } as LlmConfig;
  }
};

const llmConf = reactive<LlmConfig>(llmConfigFromJson(json.value));

const isJsonValid = computed((): boolean => {
  const config = llmConfigFromJson(json.value);
  if (!config.model_provider || !config.model) {
    return false;
  }
  if (config.temperature && (config.temperature < 0 || config.temperature > 1)) {
    return false;
  }
  const provider = store.providers.find((p) => p.model_provider === config.model_provider);
  if(!provider) {
    return false;
  }
  const model = provider.models?.find((m) => m.name === config.model);
  if (!model) {
    return false;
  }
  if (config.max_tokens && (config.max_tokens < 0 || model.tokens_limit && config.max_tokens > model.tokens_limit)) {
    return false;
  }
  return true;
});

const switchConfigEditor = () => {
  if (editorEnabled.value) {
    if (!isJsonValid.value) {
      modal.openModal('LlmConfigWarn');
    }
  }
  editorEnabled.value = !editorEnabled.value;
};

watch(
  json,
  (val) => {
    try {
      const newConf = llmConfigFromJson(val);
      llmConf.model_provider = newConf.model_provider;
      llmConf.model = newConf.model;
      llmConf.temperature = newConf.temperature;
      llmConf.max_tokens = newConf.max_tokens;
    } catch (e) {
      console.error('Invalid JSON', e);
    }
  },
  { immediate: true },
);

watch(
  llmConf,
  (val) => {
    json.value = JSON.stringify(val, null, 2);
  },
  { immediate: true },
);
</script>
