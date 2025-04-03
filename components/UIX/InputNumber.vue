<template>
  <div class="flex flex-col space-y-2">
    <label v-if="label" class="flex align-top leading-none space-x-1" :for="uniqueId">
      <span>{{ label }}</span>
    </label>

    <div class="space-y-1">
      <input :id="uniqueId" ref="input" type="number" class="w-full" v-model.number="model" :readonly="readonly" :min="min" :max="max" :step="step" />

      <p class="text-right text-xs pr-2" v-if="hint" v-text="hint" />
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<number | null>();

const props = defineProps({
  label: String,
  hint: String,
  min: Number,
  max: Number,
  step: Number,
  readonly: { type: Boolean, default: false },
});

const input = ref<HTMLInputElement>();
const uniqueId = useId();
</script>
