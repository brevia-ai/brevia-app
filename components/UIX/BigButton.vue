<template>
  <NuxtLink class="big-button relative flex-row justify-between sm:flex-col sm:justify-center gap-1 md:gap-0" :to="link">
    <div class="grow md:pb-3 flex flex-col justify-center sm:items-center sm:text-center space-y-0.5">
      <h2 class="text-3xl md:text-4xl font-black leading-tight tracking-wider">{{ capitalLetters(item.title, item.type) }}</h2>
      <h1 class="md:text-lg leading-tight">{{ itemTitle(item.title, item.type) }}</h1>
    </div>

    <div class="static md:absolute bottom-7 flex items-center space-x-2 text-sky-300 opacity-90">
      <Icon v-if="item.type === 'chatbot'" class="opacity-70" name="carbon:chat-bot" size="28" />
      <Icon v-else-if="item.type === 'analysis'" class="opacity-70" name="carbon:search-locate" size="28" />
      <Icon v-else-if="item.type === 'summary'" class="opacity-70" name="carbon:license-maintenance" size="28" />
      <Icon v-else-if="item.type === 'transcription'" class="opacity-70" name="carbon:document-audio" size="28" />
      <Icon v-else class="opacity-70" name="carbon:idea" size="28" />
      <span class="text-xs uppercase tracking-wider">{{ item.type }}</span>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  link: {
    type: String,
    default: '',
  },
});

const capitalLetters = (title = '', type = '') => title.charAt(0).toUpperCase() + type.charAt(0).toUpperCase();
const itemTitle = (title = '', type = '') => title.replace(new RegExp(type, 'gi'), '').trim();
</script>
