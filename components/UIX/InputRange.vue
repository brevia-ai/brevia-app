<template>
  <div class="flex flex-col space-y-4">
    <label v-if="label" class="flex align-top leading-none space-x-1" :for="uniqueId">
      <span>{{ label }}</span>
    </label>

    <div class="space-y-1">
      <input
        :id="uniqueId"
        ref="input"
        type="range"
        class="w-full"
        :value="modelValue"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
      />

      <p class="font-xs font-semibold text-center">{{ value }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: '',
  },
  label: {
    type: String,
    default: null,
  },
  min: {
    type: String,
    default: 0,
  },
  max: {
    type: String,
    default: 100,
  },
  step: {
    type: String,
    default: 1,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const input = ref<HTMLInputElement>();

const value = computed(() => input.value?.value);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const uniqueId = computed(() => 'input-range-' + Date.now().toString(36) + Math.random().toString(36).substring(2));
</script>
