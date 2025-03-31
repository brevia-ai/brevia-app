<template>
  <fieldset class="relative space-y-1.5 border border-solid border-gray-300 p-5 rounded">
    <legend class="text-sm font-semibold uppercase tracking-wide"  v-text="title" />

    <template v-if="!editorEnabled">
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UIXInput v-model="provider.name" label="Provider" placeholder="es. OpenAI" :required="true" />
          <UIXInput v-model="provider.model" label="Model" placeholder="es. gpt-4o-mini" :required="true" />
          <UIXInputRange v-model="provider.temperature" label="Temperature" :min="0" :max="1" :step="0.1" />
          <UIXInputNumber v-model="provider.max_tokens" label="Max tokens" hint="max 16280" />
        </div>
      </div>
    </template>

    <button class="absolute -top-7 right-2 sm:-right-3 !py-1.5 button button-secondary button-xs uppercase" @click="editorEnabled = !editorEnabled">
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

type Provider = {
  name: string;
  model: string;
  temperature?: number;
  max_tokens?: number | null;
};

defineProps<{
  title: string;
}>();

const json = defineModel<object|string|null>();
const editorEnabled = ref(false);

const provider = reactive<Provider>({
  name: '',
  model: '',
  temperature: 0.5,
  max_tokens: null,
});

watch(json, (val) => {
  try {
    const data = typeof val === 'string' ? JSON.parse(val) : val;
    provider.name = data?._type || '';
    provider.model = data?.model_name || '';
    provider.temperature = data?.temperature ?? 0.5;
    provider.max_tokens = data?.max_tokens ?? null;
  } catch (e) {
    console.error('Invalid JSON', e);
  }
}, { immediate: true });
</script>
