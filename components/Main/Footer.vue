<template>
  <footer class="py-16 sm:py-24 px-12 flex flex-col items-center bg-gradient-to-b from-slate-900 to-slate-950 space-y-4 sm:space-y-8">
    <div class="flex text-sky-500 text-3xl sm:text-4xl space-x-8">
      <a class="hover:text-sky-300" href="https://it.linkedin.com/company/atlas-srl" target="_blank" rel="noopener">
        <Icon name="ph:linkedin-logo" />
        <span class="sr-only">LinkedIn</span>
      </a>
      <a class="hover:text-sky-300" href="https://atlasconsulting.it/" target="_blank" rel="noopener">
        <Icon name="ph:globe" />
        <span class="sr-only">Web site Atlas SRL</span>
      </a>
      <a class="hover:text-sky-300" href="https://github.com/brevia-ai/brevia" target="_blank" rel="noopener">
        <Icon name="ph:github-logo" />
        <span class="sr-only">Github</span>
      </a>
    </div>

    <div class="grid grid-cols-7 items-center text-xs font-bold leading-none tracking-wider text-white">
      <span class="col-span-3 justify-self-end whitespace-nowrap">© {{ new Date().getFullYear() }} BREVIA</span>
      <div class="justify-self-center pb-1 px-3">
        <img class="w-auto h-7" src="/logo-atlas-white.svg" />
      </div>
      <span class="col-span-3 whitespace-nowrap">made by ATLAS srl</span>
    </div>

    <div v-if="cookiesPrivacyTerms" class="flex gap-3 text-xs tracking-wider text-white">
      <NuxtLink to="/privacy/privacy-policy">Privacy Policy</NuxtLink>
      <NuxtLink to="/privacy/terms-conditions">{{ $t('TERMS_AND_CONDITIONS') }}</NuxtLink>
      <button class="hover:text-sky-300" @click="$CookieConsent.show">
        {{ $t('COOKIE_OPTIONS') }}
      </button>
    </div>

    <div class="flex gap-3 text-xs tracking-wider text-white">
      <span class="col-span-3 justify-self-end whitespace-nowrap"> Brevia App: {{ appVersion }} </span>
      <span v-if="versions?.brevia" class="col-span-3 justify-self-end whitespace-nowrap"> Brevia API: {{ versions.brevia }} </span>
      <span v-if="versions?.apiName && versions?.apiVersion" class="col-span-3 justify-self-end whitespace-nowrap">
        {{ versions?.apiName }} API: {{ versions?.apiVersion }}
      </span>
    </div>

    <div v-if="integration !== 'brevia'" class="flex gap-3 text-xs tracking-wider text-white">
      <span v-if="integrationVersions?.get(integration)" class="col-span-3 justify-self-end whitespace-nowrap"> {{ integration }} API: {{ integrationVersions?.get(integration) }} </span>
      <span v-if="integrationVersions?.get('apiName') && integrationVersions?.get('apiVersion')" class="col-span-3 justify-self-end whitespace-nowrap">
        {{ integrationVersions?.get('apiName') }} API: {{ integrationVersions?.get('apiVersion') }}
      </span>
    </div>
  </footer>
</template>
<script setup lang="ts">
const cookiesPrivacyTerms = useRuntimeConfig().public.cookiesPrivacyTerms !== '';

const appVersion = useRuntimeConfig().public.version;

const response = await fetch('/api/brevia/versions');
const versions = await response.json();

const integration = useIntegration();
const integrationVersions = await useIntegrationVersion();
</script>
