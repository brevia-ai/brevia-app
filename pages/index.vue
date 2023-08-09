<template>
    <main>
        <div class="grid sm:grid-cols-2 gap-8">
            <NuxtLink class="big-button shadow-xl hover:shadow-2xl hover:shadow-sky-800"
                v-for="(item, i) in menu" :key="i"
                :to="item.link">
                <div class="text-4xl font-bold">{{ capitalLetters(item.title, item.type) }}</div>
                <div class="text-center leading-tight">
                    {{ itemTitle(item.title, item.type) }} <span class="font-bold">{{ item.type }}</span>
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
