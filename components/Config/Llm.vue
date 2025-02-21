<template>
  <fieldset class="relative space-y-1.5 border border-solid border-gray-300 p-5 rounded">
    <legend class="text-sm font-semibold uppercase tracking-wide"  v-text="title" />

    <template v-if="!editorEnabled">
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UIXInput v-model.trim="provider.name" label="Provider" autocapitalize="none" />
          <UIXInput v-model.trim="provider.model" label="Model" autocapitalize="none" />
          <UIXInputRange v-model.number="provider.temperature" label="Temperature" min="0" max="1" step="0.1" />
          <UIXInputNumber v-model.trim.number="provider.max_tokens" label="Max tokens" hint="max 16280" />
        </div>
        <button class="absolute -top-10 right-2 !py-1 button button-secondary button-xs uppercase" @click="editorEnabled = !editorEnabled">
          <span v-if="editorEnabled">Editor guidato</span>
          <span v-else>Editor avanzato</span>
        </button>
      </div>
    </template>

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
  max_tokens?: number;
};

defineProps<{
  title: string;
}>();

const json = defineModel<object|string|null>();
const editorEnabled = ref(false);

const provider = computed((): Provider => {
  let data;
  try {
    data = JSON.parse(JSON.stringify(json.value) || '');
  } catch (e) {
    console.error('INVALID JSON', e);
  }

  return {
    name: data?._type || '',
    model: data?.model_name || '',
    temperature: data?.temperature || 0,
    max_tokens: data?.max_tokens || null,
  };
});
</script>
