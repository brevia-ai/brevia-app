<template>
<header class="py-4 px-6 flex space-x-4 justify-between items-center">
    <div>
        <h1 class="text-4xl font-bold hover:text-sky-800">
            <NuxtLink to="/">CHATLAS</NuxtLink>
        </h1>
        <h2>Atlas AI-powered tools</h2>
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
