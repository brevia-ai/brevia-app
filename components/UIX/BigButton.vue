<template>
<NuxtLink class="big-button flex-row justify-between sm:flex-col sm:justify-center gap-6 lg:gap-10"
    :to="link">

    <div class="grow sm:pt-16 md:pt-16 flex flex-col justify-center sm:items-center sm:text-center">
        <div class="text-5xl leading-tight font-semibold">{{ capitalLetters(item.title, item.type) }}</div>
        <div class="text-lg lg:text-xl leading-tight">{{ itemTitle(item.title, item.type) }}</div>
    </div>

    <div class="flex items-center space-x-2 text-sky-300 opacity-90">
        <Icon class="opacity-70" name="carbon:chat-bot" size="28" v-if="item.type === 'chatbot'" />
        <Icon class="opacity-70" name="carbon:search-locate" size="28" v-else-if="item.type === 'analysis'" />
        <Icon class="opacity-70" name="carbon:license-maintenance" size="28" v-else-if="item.type === 'summary'" />
        <Icon class="opacity-70" name="carbon:document-audio" size="28" v-else-if="item.type === 'transcription'" />
        <Icon class="opacity-70" name="carbon:idea" size="28" v-else />
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
