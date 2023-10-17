<template>
    <main>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            <NuxtLink class="big-button flex-row justify-between sm:flex-col sm:justify-center gap-6 lg:gap-10"
                v-for="(item, i) in menu" :key="i"
                :to="item.link">
                <div class="grow sm:pt-16 flex flex-col justify-center sm:items-center sm:text-center">
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

            <button class="big-button py-6 bg-slate-50 text-slate-700 hover:bg-white hover:text-pink-600"
                @click="add">
                <Icon name="carbon:add-large" size="64" />
            </button>
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
        add() {
            this.$openModal('create-chatbot');
        },
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
