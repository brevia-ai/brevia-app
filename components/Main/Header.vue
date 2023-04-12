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

    <NuxtLink class="w-8 h-8 button" to="/"
        v-if="$route.name === 'about'">⌂</NuxtLink>

    <NuxtLink class="w-8 h-8 button" to="/about" v-else>
        ?</NuxtLink>
</header>
</template>

<script>
export default {
    props: {
        route: {
            type: Object,
            default: {},
        }
    },
}
</script>
