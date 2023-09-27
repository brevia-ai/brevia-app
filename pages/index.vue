<template>
    <main>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            <NuxtLink class="big-button flex-row justify-between sm:flex-col sm:justify-center gap-6 lg:gap-10"
                v-for="(item, i) in menu" :key="i"
                :to="item.link">
                <div class="sm:text-center">
                    <div class="text-5xl leading-tight font-semibold">{{ capitalLetters(item.title, item.type) }}</div>
                    <div class="text-lg lg:text-xl leading-tight">{{ itemTitle(item.title, item.type) }}</div>
                </div>

                <div class="text-center space-y-1.5 text-sky-400 opacity-80">
                    <div class="text-xs uppercase tracking-wide">{{ item.type }}</div>
                    <Icon class="opacity-70" name="carbon:chat-bot" :size="42" v-if="item.type === 'chatbot'" />
                    <Icon class="opacity-70" name="carbon:search-locate" :size="42" v-else-if="item.type === 'analysis'" />
                    <Icon class="opacity-70" name="carbon:license-maintenance" :size="42" v-else-if="item.type === 'summary'" />
                    <Icon class="opacity-70" name="carbon:document-audio" :size="42" v-else-if="item.type === 'transcription'" />
                    <Icon class="opacity-70" name="carbon:idea" :size="42" v-else />
                </div>

            </NuxtLink>
        </div>
    </main>
</template>

<script setup>
    useHead({ title: 'Chatlas', });
</script>

<script>
import { useStatesStore } from '~~/store/states';

export default {
    data() {
        return {
            menu: [],
        }
    },

    created() {
        const store = useStatesStore();
        this.menu = store.getMenu();
    },

    methods: {
        capitalLetters(title, type) {
            return (title?.charAt(0)?.toUpperCase() || '') +
                (type?.charAt(0)?.toUpperCase() || '');
        },
        itemTitle(title, type) {
            return title?.replace(new RegExp(type,'gi'), '')?.trim() || '';
        },
    },
}
</script>
