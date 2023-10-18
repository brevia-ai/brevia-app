<template>
    <main>
        <div class="grid" :class="menu.length > 6? 'grid-dashboard-autofill' : 'grid-dashboard w-full mx-auto max-w-[90rem]'"
            v-if="menu.length">
            <NuxtLink class="big-button flex-row justify-between sm:flex-col sm:justify-center gap-6 lg:gap-10"
                v-for="(item, i) in menu" :key="i"
                :to="item.link">
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

            <button class="big-button place-self-stretch py-6 bg-slate-50 text-slate-700 hover:bg-white hover:text-pink-600"
                @click="add" v-if="addAvailable">
                <Icon name="carbon:add-large" size="64" />
            </button>
        </div>
        <div v-else>
            {{ $t('WELCOME') }} {{ statesStore.user?.name }} {{ statesStore.user?.surname }}
        </div>
    </main>
</template>

<script setup>
    useHead({ title: 'Chatlas', });
</script>

<script>
import { useStatesStore } from '~~/store/states';
import { mapStores } from 'pinia';

export default {
    data() {
        return {
            menu: [],
            maxUserChatbots: null,
        }
    },

    computed: {
        ...mapStores(useStatesStore),

        addAvailable() {
            if (!this.maxUserChatbots) {
                return true;
            }
            const collections = this.menu.filter((x) => x.type === 'chatbot');

            return collections?.length < this.maxUserChatbots;
        }
    },

    created() {
        this.menu = this.statesStore.getMenu();
        const config = useRuntimeConfig();
        this.maxUserChatbots = config.public?.maxUserChatbots || null;
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
