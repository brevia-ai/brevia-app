<template>
  <select
    v-model="model"
    :id="uniqueId"
    class="h-14 px-4 border rounded border-primary
      bg-white hover:bg-sky-100 focus:outline-primary
      text-primary text-xl"
  >
    <option v-for="(item, i) in options" :key="i" :value="item" class="px-4">{{ item }}</option>
  </select>
</template>


<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const model = defineModel();
const uniqueId = computed(() => 'input-range-' + Date.now().toString(36) + Math.random().toString(36).substring(2));
</script>
