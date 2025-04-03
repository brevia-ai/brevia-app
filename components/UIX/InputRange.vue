<template>
  <div class="flex flex-col space-y-4">
    <label v-if="label" class="flex align-top leading-none space-x-1" :for="uniqueId">
      <span>{{ label }}</span>
    </label>

    <div class="space-y-1">
      <input :id="uniqueId" ref="input" type="range" class="w-full" v-model.number="model" :readonly="readonly" :min="min" :max="max" :step="step" />
      <p class="font-semibold text-center">{{ model }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<number | null>();

defineProps({
  label: { type: String, default: '' },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  readonly: { type: Boolean, default: false },
});

const input = ref<HTMLInputElement>();
const uniqueId = useId();
</script>
