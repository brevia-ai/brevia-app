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
            <h2 class="pl-1 leading-tight">{{ $t('ATLAS_AI_POWERED_TOOLS') }}</h2>
        </div>
    </div>

    <div class="flex space-x-2">
        <button class="w-10 h-10 button border-none"
            v-for="(lang, i) in availableLocales" :key="i"
            @click="setLocale(lang as string)">{{ lang }}</button>

        <button class="h-10 px-4 button text-sm leading-none bg-black hover:bg-red-800" @click="logout" v-if="stateStore.isLogged">
            <span class="sm:hidden">⍈</span>
            <span class="hidden sm:inline">{{ $t('LOGOUT') }}</span>
        </button>

        <NuxtLink class="w-10 h-10 button border-none" to="/" v-if="$route.name === 'about'">⌂</NuxtLink>
        <NuxtLink class="w-10 h-10 button" to="/about" v-else-if="!stateStore.isLogged">?</NuxtLink>
    </div>
</header>
</template>

<script setup lang="ts">
import { useStatesStore } from '~~/store/states';

const { locale, locales, setLocale } = useI18n();
const stateStore = useStatesStore();

const availableLocales = computed(() => {
    return (locales.value).filter(lang => lang !== locale.value);
});

function logout() {
    stateStore.userLogout();
}

</script>
