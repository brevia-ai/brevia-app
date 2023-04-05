<template>
    <div class="h-screen flex flex-col">
        <div class="p-6 grow w-full max-w-3xl mx-auto space-y-8">
            <header class="flex space-x-4 justify-between items-center">
                <div class="text-neutral-100">
                    <h1 class="text-3xl font-bold hover:text-sky-300">
                        <NuxtLink to="/">CHATLAS</NuxtLink>
                    </h1>
                    <h2>Atlas AI-powered tools</h2>
                </div>

                <NuxtLink class="bg-sky-700 hover:bg-sky-600 text-white w-8 h-8 rounded flex items-center justify-center" to="/"
                    v-if="$route.name === 'about'">⌂</NuxtLink>

                <NuxtLink class="bg-sky-700 hover:bg-sky-600 text-white w-8 h-8 rounded flex items-center justify-center" to="/about" v-else>
                    ?</NuxtLink>
            </header>

            <NuxtPage />
        </div>

        <footer class="p-4 bg-neutral-950 text-white text-center text-xs">
            © {{ new Date().getFullYear() }} • ATLAS srl
        </footer>
    </div>
</template>
