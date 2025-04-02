<template>
  <fieldset class="relative space-y-1.5 border border-solid border-gray-300 p-5 rounded">
    <legend class="text-sm font-semibold uppercase tracking-wide"  v-text="title" />

    <template v-if="!editorEnabled">
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <!-- oppure con options array di oggetti label/value -->
        <UIXSelect v-model="llmConfig.model_provider"
          label="Provider"
          :options="availableProviders()"
          :placeholder="$t('SELECT_PROVIDER')"
          :required="true" />

        <UIXSelect v-model="llmConfig.model"
          label="Model"
          :options="availableModels"
          :placeholder="$t('SELECT_MODEL')"
          :required="true" />

          <UIXInputRange v-model="llmConfig.temperature" label="Temperature" :min="0" :max="1" :step="0.1" />
          <UIXInputNumber v-model="llmConfig.max_tokens" label="Max tokens" hint="max 16280" :step="100"/>
        </div>
      </div>
    </template>

    <button class="absolute -top-7 right-2 sm:-right-3 !py-1.5 button button-secondary button-xs uppercase" @click.prevent="editorEnabled = !editorEnabled">
      <Icon :name="editorEnabled ? 'ph:arrow-fat-line-left-bold' : 'ph:arrow-elbow-down-right-bold'" class="w-4 h-4" />
      <span v-text="editorEnabled? 'Standard' : 'Advanced'"></span>
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
  temperature?: number;
  max_tokens?: number | null;
};

defineProps<{
  title: string;
}>();

const store = useProvidersStore();

const json = defineModel<object|string|null>();
const editorEnabled = ref(false);

const availableProviders = () => {
  return store.providers.map((provider: Provider) => ({
    label: provider.model_provider,
    value: provider.model_provider,
  }));
};

const availableModels = computed(() => {
  const models = store.providers.find((p) => p.model_provider === llmConfig.model_provider)?.models?.map((m) => m.name) || [];
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

const llmConfig = reactive<LlmConfig>(llmConfigFromJson(json.value));

watch(json, (val) => {
  try {
    const newConf = llmConfigFromJson(val);
    llmConfig.model_provider = newConf.model_provider;
    llmConfig.model = newConf.model;
    llmConfig.temperature = newConf.temperature;
    llmConfig.max_tokens = newConf.max_tokens;
  } catch (e) {
    console.error('Invalid JSON', e);
  }
}, { immediate: true });

watch(llmConfig, (val) => {
  json.value = JSON.stringify(val, null, 2);
}, { immediate: true });

</script>
