<template>
  <div class="grid" :class="menu.length > 6 ? 'grid-dashboard-autofill' : 'grid-dashboard w-full mx-auto max-w-[90rem]'">
    <UIXBigButton v-for="(item, i) in menu" :key="i" :item="item" :link="item.link" />

    <button
      v-if="addEnabled"
      class="big-button place-self-stretch py-6 from-slate-50 to-slate-50 text-slate-700 hover:from-white hover:to-white hover:text-sky-500"
      @click="$openModal('DialogNewChatbot')"
    >
      <Icon name="ph:plus-bold" size="64" />
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  menu: {
    type: Object,
    default: null,
  },

  addEnabled: {
    type: Boolean,
    default: true,
  },
});
</script>
