<template>
  <div class="space-y-8">
    <div class="w-full pb-2">
      <div class="tabs">
        <button v-for="(tab, i) in tabs" :key="i" class="font-normal" :class="{ active: active === i }" @click="active = i">{{ tab }}</button>
      </div>
    </div>

    <div>
      <slot :name="active" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: Number,
    default: 0,
  },
});

const active = ref(props.activeTab);
</script>
