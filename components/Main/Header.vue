<template>
<header class="py-4 px-4 sm:px-6 flex space-x-4 justify-between items-center">
    <div class="flex flex-col space-y-1 sm:space-y-0">
        <h1 class="flex space-x-1.5 text-4xl font-black text-slate-900 hover:text-sky-600 cursor-pointer">
            <ElementLogo class="mt-0.5 h-[36px] w-auto" />
            <NuxtLink to="/">
                <span class="leading-none">{{ config.public.appName }}</span>
            </NuxtLink>
        </h1>
        <h2 class="ml-0.5 pl-3 sm:pl-10 text-sky-950 text-sm sm:text-base leading-none">{{ config.public.appDescription || $t('TITLES.ATLAS_AI_POWERED_TOOLS') }}</h2>
    </div>

    <div class="flex space-x-2 sm:space-x-4 md:space-x-5">
        <button class="w-12 h-10 button border-none text-xs uppercase"
            v-for="(lang, i) in availableLocales" :key="i"
            @click="setLocale(lang as string)">{{ lang }}</button>

        <button class="h-10 px-4  button border-none text-sm uppercase" v-if="stateStore.isLogged">
            <NuxtLink to="/profile">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </NuxtLink>
        </button>

        <button class="h-10 px-4 sm:px-8 button text-sm leading-none bg-slate-900 hover:bg-danger hover:border-pink-800"
            @click="logout" v-if="stateStore.isLogged">
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

const config = useRuntimeConfig();
const { locale, locales, setLocale } = useI18n();
const stateStore = useStatesStore();

const availableLocales = computed(() => {
    return (locales.value as Array<String>).filter(lang => lang !== locale.value);
});

async function logout() {
    await $fetch('/api/bedita/auth/logout');
    stateStore.userLogout();
    navigateTo('/auth');
}
</script>
