<template>
<header class="py-4 px-4 sm:px-6 flex space-x-4 justify-between items-center">
    <div class="flex space-x-2">
        <img class="mt-0.5 h-[36px] w-auto" src="/brevia-logo.svg" alt="Atlas logo">
        <div class="text-sky-950">
            <h1 class="text-4xl font-black text-slate-950 hover:text-sky-700">
                <NuxtLink to="/">
                    <span class="leading-none">BREVIA</span>
                </NuxtLink>
            </h1>
            <h2 class="pl-1 text-sm sm:text-base leading-none">{{ $t('TITLES.ATLAS_AI_POWERED_TOOLS') }}</h2>
        </div>
    </div>

    <div class="flex space-x-2 sm:space-x-4 md:space-x-5">
        <button class="w-12 h-10 button border-none text-xs uppercase"
            v-for="(lang, i) in availableLocales" :key="i"
            @click="setLocale(lang as string)">{{ lang }}</button>

        <button class="h-10 px-4 sm:px-8 button text-sm leading-none bg-slate-900 hover:bg-danger hover:border-pink-800" @click="logout" v-if="stateStore.isLogged">
            <div class="sm:hidden">
                <Icon name="ph:sign-out-bold" class="text-lg" />
            </div>
            <span class="hidden sr-only sm:not-sr-only sm:inline">{{ $t('LOGOUT') }}</span>
        </button>

        <NuxtLink class="w-12 h-10 button border-none" to="/" v-if="$route.name === 'about'">
            <Icon name="ph:house-simple-bold" class="text-lg" />
        </NuxtLink>
        <NuxtLink class="w-12 h-10 button font-bold text-lg" to="/about" v-else-if="!stateStore.isLogged">?</NuxtLink>
    </div>
</header>
</template>

<script setup lang="ts">
import { useStatesStore } from '~~/store/states';

const { locale, locales, setLocale } = useI18n();
const stateStore = useStatesStore();

const availableLocales = computed(() => {
    return (locales.value as Array<String>).filter(lang => lang !== locale.value);
});

async function logout() {
    await $fetch('/api/logout');
    stateStore.userLogout();
    stateStore.setMenu([]);
    navigateTo('/auth');
}
</script>
