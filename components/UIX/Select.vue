<template>
  <div class="flex flex-col space-y-2">
    <label v-if="label" class="flex align-top leading-none space-x-1" :for="uniqueId">
      <span>{{ label }}</span>
      <Icon v-if="required" name="ph:star-fill" size="12" class="text-pink-600" />
    </label>

    <select
      v-model="model"
      :id="uniqueId"
      class="border-2 border-neutral-300 rounded outline-sky-600
        text-neutral-900 bg-slate-50
        text-lg px-4 py-3.5"
      :disabled="readonly"
      :required="required"
    >
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option
        v-for="(opt, i) in normalizedOptions"
        :key="i"
        :value="typeof opt === 'object' ? opt.value : opt"
        v-text="typeof opt === 'object' ? opt.label : opt"
      />
    </select>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string | number | null>();

const props = defineProps({
  label: String,
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: String,
  options: {
    type: Array as PropType<Array<string | { label: string; value: string | number }>>,
    default: () => [],
  },
});

const uniqueId = useId();

// normalizza le opzioni per accettare sia string[] che object[]
const normalizedOptions = computed(() => props.options);
</script>
