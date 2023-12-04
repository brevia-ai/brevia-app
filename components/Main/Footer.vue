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
            <img class="w-auto h-7" src="/logo-atlas-white.svg">
        </div>
        <span class="col-span-3 whitespace-nowrap">made by ATLAS srl</span>
    </div>

    <div class="grid grid-cols-3 items-center text-xs font-bold leading-none tracking-wider text-white"
        v-if="cookiesPrivacyTerms">
        <a href="https://www.iubenda.com/privacy-policy/49496944"
            class="iubenda-embed iubenda-noiframe "
            title="iubenda-white Privacy Policy ">Privacy Policy</a>
        <a href="https://www.iubenda.com/termini-e-condizioni/49496944"
            class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe "
            title="Termini e Condizioni ">Termini e Condizioni</a>
        <button class="hover:text-sky-300" @click="$CookieConsent.show">Cookies</button>
    </div>
</footer>
</template>
<script setup lang="ts">
const cookiesPrivacyTerms = useRuntimeConfig().public.cookiesPrivacyTerms !== '';
</script>
