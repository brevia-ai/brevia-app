<template>
  <header class="py-4 px-4 sm:px-6 flex space-x-4 justify-between items-center">
    <div class="flex flex-col space-y-1 sm:space-y-0">
      <h1 class="flex space-x-1.5 text-4xl font-black text-slate-900 hover:text-sky-600 cursor-pointer">
        <ElementLogo class="mt-0.5 h-[36px] w-auto" />
        <NuxtLink to="/">
          <span v-if="statesStore.project" class="leading-none">{{ config.public.appName }} - {{ statesStore.project }}</span>
          <span v-else class="leading-none">{{ config.public.appName }}</span>
        </NuxtLink>
      </h1>
      <h2 class="ml-0.5 pl-3 sm:pl-10 text-sky-950 text-sm sm:text-base leading-none">
        {{ config.public.appDescription || $t('TITLES.ATLAS_AI_POWERED_TOOLS') }}
      </h2>
    </div>

    <div class="flex space-x-2 sm:space-x-4 md:space-x-5">
      <button v-for="(lang, i) in availableLocales" :key="i" class="w-12 h-10 button border-none text-xs uppercase" @click="setLocale(lang as string)">
        {{ lang }}
      </button>
      <button v-if="statesStore.isLogged() && features.signup" class="h-10 px-4 button border-none text-sm uppercase">
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

      <button v-if="statesStore.userHasRole('admin')" class="h-10 px-4 button border-none text-sm uppercase">
        <NuxtLink to="/general-config" class="flex space-x-2">
          <Icon name="ph:gear-bold" class="text-lg" />
          <span class="hidden sr-only sm:not-sr-only sm:inline">{{ $t('SETTINGS') }}</span>
        </NuxtLink>
      </button>

      <button
        v-if="statesStore.isLogged()"
        class="h-10 px-4 sm:px-8 button text-sm leading-none bg-slate-900 hover:bg-danger hover:border-pink-800"
        @click="onLogout"
      >
        <div class="sm:hidden">
          <Icon name="ph:sign-out-bold" class="text-lg" />
        </div>
        <span class="hidden sr-only sm:not-sr-only sm:inline">{{ $t('LOGOUT') }}</span>
      </button>

      <NuxtLink v-if="route.name === 'about'" class="w-12 h-10 button border-none" to="/">
        <Icon name="ph:house-simple-bold" class="text-lg" />
      </NuxtLink>
      <NuxtLink v-else-if="!statesStore.isLogged()" class="w-12 h-10 button font-bold text-lg" to="/about">?</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();
const { locale, locales, setLocale } = useI18n();
const { logout } = useIntegrationAuth();
const statesStore = useStatesStore();
const features = useIntegrationFeatures();

const availableLocales = computed(() => {
  return (locales.value as Array<string>).filter((lang) => lang !== locale.value);
});

async function onLogout() {
  let to = '/auth';
  if (!!config.public.projectLogin === true) {
    const path = statesStore.project?.toLowerCase()?.replace(/ /g, '-');
    to = `/project-login/${path}`;
  }
  await logout();
  statesStore.$reset();
  await navigateTo(to);
}
</script>
