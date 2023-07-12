<template>
    <main>
        <div class="grid sm:grid-cols-2 gap-8">
            <NuxtLink class="big-button shadow-xl hover:shadow-2xl hover:shadow-sky-800"
                v-for="(item, i) in menu" :key="i"
                :to="item.link">
                <div class="text-4xl font-bold" v-if="isChatbot(item.link)">SC</div>
                <div class="text-4xl font-bold" v-if="isSummary(item.link)">DS</div>
                <div class="text-4xl font-bold" v-if="isTranscription(item.link)">AT</div>
                <div class="text-center leading-tight">
                    <slot v-if="isChatbot(item.link)">
                        {{ item.title }} <span class="font-bold">chatbot</span>
                    </slot>
                    <slot v-if="isSummary(item.link)">
                        Document <span class="font-bold">summary</span>
                    </slot>
                    <slot v-if="isTranscription(item.link)">
                        Audio <span class="font-bold">transcription</span>
                    </slot>
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
        isChatbot(link) {
            return link?.startsWith('/chatbot/') || false;
        },
        isSummary(link) {
            return link == '/summary';
        },
        isTranscription(link) {
            return link == '/transcription';
        },
    },
}
</script>
