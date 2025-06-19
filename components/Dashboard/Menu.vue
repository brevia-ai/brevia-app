<template>
  <div class="grid" :class="menu.length > 6 ? 'grid-dashboard-autofill' : 'grid-dashboard w-full mx-auto max-w-[90rem]'">
    <UIXBigButton v-for="(item, i) in menu" :key="i" :item="item" :link="item.link" />

    <button
      v-if="addEnabled"
      class="big-button relative flex-row justify-between sm:flex-col sm:justify-center gap-1 md:gap-0 place-self-stretch py-6 from-slate-50 to-slate-50 text-slate-700 hover:from-white hover:to-white hover:text-sky-500"
      @click="$openModal('DialogNewChatbot')"
    >
      <div class="grow md:pb-3 flex flex-col justify-center">
        <Icon name="ph:plus-bold" size="64" />
      </div>
      <div class="flex items-center space-x-2">
        <Icon class="opacity-70" name="carbon:chat-bot" size="28" />
        <span class="text-xs uppercase tracking-wider">new chatbot</span>
      </div>
    </button>
    <NuxtLink class="big-button relative flex-row justify-between sm:flex-col sm:justify-center gap-1 md:gap-0" to="/conversation">
      <div class="grow md:pb-3 flex flex-col justify-center sm:items-center sm:text-center space-y-0.5">
        <Icon class="h-11 w-11" name="ph:chats-fill" />
        <h1 class="md:text-lg leading-tight">{{ $t('CHECK_MODEL') }}</h1>
      </div>
      <div class="static md:absolute bottom-7 flex items-center space-x-2 text-sky-300 opacity-90">
        <Icon class="opacity-70" name="carbon:chat-off" size="28" />
        <span class="text-xs uppercase tracking-wider">{{ $t('CONVERSATION.TYPE') }}</span>
      </div>
    </NuxtLink>
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
