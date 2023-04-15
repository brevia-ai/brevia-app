<template>
<header class="py-4 px-6 flex space-x-4 justify-between items-center">
    <div class="flex space-x-2">
        <img class="mt-2 h-[26px] w-auto" src="/logo.png" alt="Chatlas logo">
        <div>
            <h1 class="text-4xl font-bold hover:text-sky-800">
                <NuxtLink to="/">
                    <span class="leading-none">CHATLAS</span>
                </NuxtLink>
            </h1>
            <h2 class="pl-1 leading-tight">Atlas AI-powered tools</h2>
        </div>
    </div>

    <div class="flex space-x-2">
        <NuxtLink class="w-10 h-10 button border-none" to="/" v-if="$route.name === 'about'">⌂</NuxtLink>
        <NuxtLink class="w-10 h-10 button" to="/about" v-else>?</NuxtLink>

        <button class="h-10 px-4 button text-sm leading-none bg-black hover:bg-red-800" @click="logout" v-if="isLogged">
            <span class="sm:hidden">⍈</span>
            <span class="hidden sm:inline">Logout</span>
        </button>
    </div>
</header>
</template>

<script>
import { mapState } from 'pinia'
import { useStatesStore } from '~~/store/states';

export default {
    props: {
        route: {
            type: Object,
            default: {},
        }
    },

    computed: {
        ...mapState(useStatesStore, ['isLogged']),
    },

    methods: {
        logout() {
            const store = useStatesStore();
            store.userLogout();
        }
    }
}
</script>
