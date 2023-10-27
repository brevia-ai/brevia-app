<template>
<footer class="mt-8 py-28 px-12 flex flex-col items-center bg-gradient-to-b from-slate-800 to-slate-950 space-y-9">
    <div class="flex space-x-8 text-lobster">
        <a class="hover:text-rose-400" href="https://atlasconsulting.it/" target="_blank" rel="noopener">
            <Icon name="ph:globe" class="text-4xl" />
            <span class="sr-only">Web site Atlas SRL</span>
        </a>
        <a class="hover:text-rose-400" href="https://it.linkedin.com/company/atlas-srl" target="_blank" rel="noopener">
            <Icon name="ph:linkedin-logo" class="text-4xl" />
            <span class="sr-only">LinkedIn</span>
        </a>
        <a class="hover:text-rose-400" href="https://github.com/atlasconsulting" target="_blank" rel="noopener">
            <Icon name="ph:github-logo" class="text-4xl" />
            <span class="sr-only">Github</span>
        </a>
    </div>

    <div class="grid grid-cols-3 items-center text-xs font-bold leading-none tracking-wider text-white">
        <span class="justify-self-end whitespace-nowrap">© {{ new Date().getFullYear() }} BREVIA</span>
        <div class="justify-self-center pb-1">
            <img class="w-auto h-8" src="/logo-atlas-lobster.svg">
        </div>
        <span class="whitespace-nowrap">by ATLAS srl</span>
    </div>
</footer>
</template>
