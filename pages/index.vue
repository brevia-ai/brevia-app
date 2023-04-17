<template>
    <main>
        <div class="grid sm:grid-cols-2 gap-8">
            <NuxtLink class="big-button shadow-xl hover:shadow-2xl hover:shadow-sky-800"
                v-for="(item, i) in menu" :key="i"
                :to="item.link">
                <div class="text-4xl font-bold" v-if="item.link != '/summary'">SC</div>
                <div class="text-4xl font-bold" v-else>DS</div>
                <div class="text-center leading-tight">
                    <slot v-if="item.link != '/summary'">
                        {{ item.title }} <span class="font-bold">chatbot</span>
                    </slot>
                    <slot v-else>
                        Document <span class="font-bold">summary</span>
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
}
</script>
