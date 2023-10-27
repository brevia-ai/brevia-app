<template>
<footer class="py-28 px-12 flex flex-col items-center bg-gradient-to-b from-slate-900 to-slate-950 space-y-8">
    <div class="flex space-x-8 text-sky-500">
        <a class="hover:text-sky-300" href="https://it.linkedin.com/company/atlas-srl" target="_blank" rel="noopener">
            <Icon name="ph:linkedin-logo" class="text-4xl" />
            <span class="sr-only">LinkedIn</span>
        </a>
        <a class="hover:text-sky-300" href="https://atlasconsulting.it/" target="_blank" rel="noopener">
            <Icon name="ph:globe" class="text-4xl" />
            <span class="sr-only">Web site Atlas SRL</span>
        </a>
        <a class="hover:text-sky-300" href="https://github.com/atlasconsulting" target="_blank" rel="noopener">
            <Icon name="ph:github-logo" class="text-4xl" />
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
</footer>
</template>
